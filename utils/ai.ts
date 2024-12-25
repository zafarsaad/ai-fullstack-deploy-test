import { OpenAI } from 'langchain/llms/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import z from 'zod'

const parser = StructuredOutputParser.fromZodSchema(
    z.object({
        mood: z.string().describe('the mood of the person who wrote the entry.'),
        summary: z.string().describe('a short summary of the entire entry.'),
        // subject: z.string().describe(''),
        color: z.string().describe('a hexadecimal color code representing the mood of the entry. Example #008000 for a really happy entry and #800000 for a really negative entry'),
        negative: z.boolean().describe('is the the journal entry contain negative emotion?')
    })
)

export const analyze = async (prompt) => {
    const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' })
    const result = await model.call(prompt)
    console.log(result)
}