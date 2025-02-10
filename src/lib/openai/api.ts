
const BASE_URL = "https://api.openai.com/v1";

export const callOpenAIChat = async (messages: any[], apiKey: string) => {
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('OpenAI API Error:', errorData);
    
    if (response.status === 429) {
      throw new Error('OpenAI API quota exceeded. Please check your plan and billing details.');
    }
    
    throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export const generateDallEImage = async (prompt: string, apiKey: string): Promise<string> => {
  const response = await fetch(`${BASE_URL}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      size: "1792x1024",
      quality: "standard",
      style: "natural",
      n: 1,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Image generation error:', errorData);
    
    if (response.status === 429) {
      throw new Error('OpenAI API quota exceeded. Please check your plan and billing details.');
    }
    
    throw new Error(`Image generation error: ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.data[0].url;
};
