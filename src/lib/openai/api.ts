
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
      throw new Error('Limite de quota da API OpenAI atingido. Por favor, verifique seu plano e detalhes de faturamento.');
    }
    
    throw new Error(`Erro na API OpenAI: ${errorData.error?.message || 'Erro desconhecido'}`);
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
      throw new Error('Limite de quota da API OpenAI atingido. Por favor, verifique seu plano e detalhes de faturamento.');
    }
    
    throw new Error(`Erro ao gerar imagem: ${errorData.error?.message || 'Erro desconhecido'}`);
  }

  const data = await response.json();
  return data.data[0].url;
};
