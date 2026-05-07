import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

async function testOpenAI() {
  console.log('Using API Key:', process.env.OPENAI_API_KEY ? 'Set' : 'Not Set');
  try {
    const dummyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a cybersecurity expert. Analyze the screenshot for scam indicators. Return ONLY a valid JSON object: {"isScam": boolean, "confidence": number, "threatLevel": "Low/Medium/High", "category": "string", "summary": "string", "redFlags": ["string"], "recommendations": ["string"]}' },
        { role: 'user', content: [
          { type: 'text', text: 'Analyze this screenshot for scam/phishing patterns.' },
          { type: 'image_url', image_url: { url: dummyImage } }
        ]}
      ],
      response_format: { type: 'json_object' },
      max_tokens: 800
    });
    console.log('Success:', response.choices[0].message.content);
  } catch (error) {
    console.error('Error Details:');
    console.error(error.message);
    if (error.response) {
      console.error(error.response.data);
    }
  }
}

testOpenAI();
