import axios, { AxiosError } from 'axios';
import type { SensorData } from '../datasets/sensor/types';

class IBMCloudService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly maxRetries = 3;
  private readonly timeout = 30000; // 30 seconds

  constructor() {
    const apiKey = import.meta.env.VITE_IBM_CLOUD_API_KEY;

    if (!apiKey) {
      throw new Error('IBM Cloud API key not found in environment variables');
    }

    this.apiKey = apiKey;
    this.baseUrl = 'https://us-south.ml.cloud.ibm.com/ml/v4/deployments/granite-3.1-8b-instruct/chat/completions';
  }

  private async retryRequest(fn: () => Promise<any>, retries = this.maxRetries): Promise<any> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0 && axios.isAxiosError(error)) {
        // Retry on network errors or 5xx server errors
        if (!error.response || (error.response.status >= 500 && error.response.status < 600)) {
          console.log(`Retrying request. Attempts remaining: ${retries - 1}`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
          return this.retryRequest(fn, retries - 1);
        }
      }
      throw error;
    }
  }

  async analyzeAnomaly(data: SensorData[]): Promise<string> {
    try {
      const anomalies = data.filter(reading => reading.is_anomaly === 1);
      const messages = this.constructMessages(anomalies);

      const response = await this.retryRequest(() => 
        axios.post(
          this.baseUrl,
          {
            messages,
            max_tokens: 250,
            temperature: 0.7,
            top_p: 0.7,
            top_k: 50,
            repetition_penalty: 1.1
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            timeout: this.timeout,
            validateStatus: (status) => status >= 200 && status < 500 // Don't reject on 4xx errors
          }
        )
      );

      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from IBM Cloud API');
      }

      return response.data.choices[0].message.content;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = this.handleAxiosError(error);
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  private handleAxiosError(error: AxiosError): string {
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }
    if (!error.response) {
      return 'Network error. Please check your internet connection.';
    }
    if (error.response.status === 401) {
      return 'Invalid API key. Please check your credentials.';
    }
    if (error.response.status === 403) {
      return 'Access denied. Please verify your API permissions.';
    }
    if (error.response.status === 429) {
      return 'Rate limit exceeded. Please try again later.';
    }
    if (error.response.status >= 500) {
      return 'IBM Cloud service is currently unavailable. Please try again later.';
    }
    return `IBM Cloud API Error: ${error.response?.data?.message || error.message}`;
  }

  private constructMessages(anomalies: SensorData[]): Array<{ role: string; content: string }> {
    const anomalyDescriptions = anomalies.map(a => 
      `- ${a.anomaly_type} detected at ${a.timestamp} (Equipment ID: ${a.equipment_id})
       Temperature: ${a.temperature}°C, Vibration: ${a.vibration_level}, 
       Power: ${a.power_consumption}W, Pressure: ${a.pressure}psi`
    ).join('\n');

    const systemPrompt = `You are an expert quantum system maintenance analyst. Analyze equipment anomalies and provide detailed insights focusing on root causes, severity, and recommended actions.`;

    const userPrompt = `Analyze these equipment anomalies and provide a comprehensive assessment:
    
${anomalyDescriptions}

Please provide:
1. A brief summary of the detected anomalies
2. Potential root causes for each anomaly type
3. Recommended immediate actions and preventive measures
4. Risk assessment and potential impact on system stability
5. Suggested monitoring parameters for future prevention`;

    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];
  }
}

export const ibmCloudService = new IBMCloudService();