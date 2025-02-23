import { delay } from '../utils/delay';

const MOCK_RESPONSES = {
  default: "I'm a  assistant to help with  Quantum Maintenance System. What would you like to know?",
  help: "I can help you understand various aspects of the system including:\n- System architecture\n- Component functionality\n- Code structure\n- Maintenance procedures\n- Anomaly detection\n- Maintenance planning\n- Predictive analysis",
  error: "I encountered an error processing your request. Please try again.",
  architecture: "The Quantum Maintenance System is built with React and uses several key components:\n- AnomalyDetection for monitoring system issues\n- MaintenancePlanner for scheduling maintenance\n- PredictiveAnalysis for forecasting potential problems\n\nThe system uses a modern tech stack including:\n- React for UI\n- Tailwind CSS for styling\n- Framer Motion for animations\n- Recharts for data visualization",
  components: "The main components include:\n- SystemChatbot for user interaction\n- AnomalyChart for visualizing data\n- Various dashboard widgets for system monitoring\n\nKey features:\n- Real-time anomaly detection\n- Predictive maintenance scheduling\n- System health monitoring\n- Performance analytics",
  anomaly: "The anomaly detection system uses IBM's Granite model to identify:\n- Temperature anomalies\n- Vibration patterns\n- Power consumption spikes\n- Pressure variations\n\nEach anomaly is classified and logged for analysis.",
  maintenance: "The maintenance planner provides:\n- Scheduled maintenance tracking\n- Priority-based task scheduling\n- Resource allocation\n- Maintenance history\n- Performance impact analysis",
  predictive: "The predictive analysis module uses:\n- IBM Granite models\n- Historical data analysis\n- Real-time monitoring\n- Performance trending\n- Risk assessment",
  code: "The codebase is organized into:\n- Components (/src/components)\n- Pages (/src/pages)\n- Services (/src/services)\n- Utilities (/src/utils)\n- Data models (/src/datasets)",
};

class MockChatService {
  async sendMessage(message: string): Promise<string> {
    // Simulate network delay (random between 500ms and 1500ms)
    await delay(Math.random() * 1000 + 500);

    const lowercaseMsg = message.toLowerCase();
    
    // Simulate occasional errors (5% chance)
    if (Math.random() < 0.05) {
      throw new Error("Simulated IBM Cloud service error");
    }

    // Enhanced keyword matching
    if (lowercaseMsg.includes('help')) {
      return MOCK_RESPONSES.help;
    }
    if (lowercaseMsg.includes('architecture') || lowercaseMsg.includes('system')) {
      return MOCK_RESPONSES.architecture;
    }
    if (lowercaseMsg.includes('component') || lowercaseMsg.includes('parts')) {
      return MOCK_RESPONSES.components;
    }
    if (lowercaseMsg.includes('anomaly') || lowercaseMsg.includes('detect')) {
      return MOCK_RESPONSES.anomaly;
    }
    if (lowercaseMsg.includes('maintenance') || lowercaseMsg.includes('schedule')) {
      return MOCK_RESPONSES.maintenance;
    }
    if (lowercaseMsg.includes('predict') || lowercaseMsg.includes('analysis')) {
      return MOCK_RESPONSES.predictive;
    }
    if (lowercaseMsg.includes('code') || lowercaseMsg.includes('structure')) {
      return MOCK_RESPONSES.code;
    }
    
    return MOCK_RESPONSES.default;
  }
}

export const mockChatService = new MockChatService();