import axios from 'axios';

interface ChatParameters {
  max_tokens: number;
  temperature: number;
  top_p: number;
  top_k: number;
  repetition_penalty: number;
  presence_penalty?: number;
  frequency_penalty?: number;
}

class ChatService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout = 30000;
  private readonly defaultParams: ChatParameters = {
    max_tokens: 250,
    temperature: 0.7,
    top_p: 0.7,
    top_k: 50,
    repetition_penalty: 1.1,
    presence_penalty: 0.5,
    frequency_penalty: 0.5
  };

  constructor() {
    const apiKey = import.meta.env.VITE_IBM_CLOUD_API_KEY;
    if (!apiKey) {
      throw new Error('IBM Cloud API key not found in environment variables');
    }
    this.apiKey = apiKey;
    this.baseUrl = 'https://us-south.ml.cloud.ibm.com/ml/v4/deployments/granite-3.1-8b-instruct/chat/completions';
  }

  private constructSystemPrompt(context?: string): string {
    const basePrompt = `You are an expert quantum system maintenance analyst with deep knowledge in quantum computing, system maintenance, and AI-driven analytics. Your responses should be:

1. Technical yet accessible
2. Focused on practical solutions
3. Based on quantum computing principles
4. Supported by data when available
5. Security-conscious and compliance-aware

Key areas of expertise:
- Quantum system architecture
- Maintenance procedures and best practices
- Anomaly detection and analysis
- Predictive maintenance
- Performance optimization
- System health monitoring
- Risk assessment and mitigation`;

    return context ? `${basePrompt}\n\nContext: ${context}` : basePrompt;
  }

  async sendMessage(
    message: string, 
    context?: string,
    params: Partial<ChatParameters> = {}
  ): Promise<string> {
    try {
      const chatParams = { ...this.defaultParams, ...params };
      
      const response = await axios.post(
        this.baseUrl,
        {
          messages: [
            {
              role: 'system',
              content: this.constructSystemPrompt(context)
            },
            {
              role: 'user',
              content: message
            }
          ],
          model: 'granite-3.1-8b-instruct',
          stream: false,
          ...chatParams
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: this.timeout
        }
      );

      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from IBM Cloud API');
      }

      return response.data.choices[0].message.content;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API Error Details:', error.response?.data);
        
        if (error.code === 'ECONNABORTED') {
          return 'Request timed out. The service is taking longer than expected to respond.';
        }
        if (!error.response) {
          return 'Unable to connect to the AI service. Please check your internet connection.';
        }
        if (error.response.status === 401) {
          return 'Authentication failed. Please check if your API key is valid.';
        }
        if (error.response.status === 403) {
          return 'Access denied. You might not have permission to use this service.';
        }
        if (error.response.status === 429) {
          return 'Too many requests. Please try again in a few moments.';
        }
        return `Service error: ${error.response.data.message || 'Unknown error occurred'}`;
      }
      return 'An unexpected error occurred. Please try again.';
    }
  }

  // Specialized method for technical analysis
  async analyzeTechnical(data: any, context?: string): Promise<string> {
    const technicalParams: Partial<ChatParameters> = {
      temperature: 0.3,
      top_p: 0.8,
      top_k: 40,
      repetition_penalty: 1.2,
      presence_penalty: 0.6,
      frequency_penalty: 0.6
    };

    return this.sendMessage(
      JSON.stringify(data),
      context,
      technicalParams
    );
  }

  // Specialized method for maintenance recommendations
  async getMaintenanceRecommendations(data: any): Promise<string> {
    const maintenanceParams: Partial<ChatParameters> = {
      temperature: 0.5,
      top_p: 0.9,
      top_k: 45,
      repetition_penalty: 1.15,
      presence_penalty: 0.4,
      frequency_penalty: 0.4
    };

    return this.sendMessage(
      JSON.stringify(data),
      'Provide detailed maintenance recommendations based on the following system data.',
      maintenanceParams
    );
  }

  // Specialized method for anomaly analysis
  async analyzeAnomalies(data: any): Promise<string> {
    const anomalyParams: Partial<ChatParameters> = {
      temperature: 0.4,
      top_p: 0.85,
      top_k: 35,
      repetition_penalty: 1.25,
      presence_penalty: 0.55,
      frequency_penalty: 0.55
    };

    return this.sendMessage(
      JSON.stringify(data),
      'Analyze the following anomalies and provide detailed insights about potential causes and recommended actions.',
      anomalyParams
    );
  }
}

export const chatService = new ChatService();