import { OpenAI } from 'langchain/llms/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { PromptTemplate } from 'langchain/prompts'
import z from 'zod'
import { Document } from 'langchain/document'
import { loadQARefineChain } from 'langchain/chains'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'

const parser = StructuredOutputParser.fromZodSchema(
    z.object({
        mood: z.string().describe('the mood of the person who wrote the entry.'),
        summary: z.string().describe('a short summary of the entire entry.'),
        subject: z.string().describe('the subject of the journal entry.'),
        color: z.string().describe('a hexadecimal color code representing the mood of the entry. Example #008000 for a really happy entry and #800000 for a really negative entry'),
        negative: z.boolean().describe('is the the journal entry contain negative emotion?')
    })
)

const getPrompt = async (content) => {
    const formatted_instructions = parser.getFormatInstructions()

    const prompt = new PromptTemplate({
        template:
            'Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{formatted_instructions}\n{entry}',
        inputVariables: ['entry'],
        partialVariables: { formatted_instructions },
    })

    const input = await prompt.format({
        entry: content
    })

    return input
}

export const analyze = async (content) => {
    const input = await getPrompt(content)
    const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' })
    const result = await model.call(input)

    try {
        return parser.parse(result)
    } catch (e) {
        console.log(e)
    }
}

export const qa = async (question, allEntries) => {
    const docs = allEntries.map(entry => {
        return new Document({
            pageContent: entry.content,
            metadata: { id: entry.id, createdAt: entry.createdAt }
        })
    })

    const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' })
    const chain = loadQARefineChain(model)
    const embeddings = new OpenAIEmbeddings()
    const store = await MemoryVectorStore.fromDocuments(docs, embeddings)
    const releventDocs = await store.similaritySearch(question)
    const res = await chain.call({
        input_documents: releventDocs,
        question,
    })

    return res.output_text
}