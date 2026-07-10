// Advanced security features
export class AdvancedSecurity {
  // Device fingerprinting
  static getDeviceFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('Pet Adoption Security', 10, 10);
    
    const fingerprint = {
      screen: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      canvas: canvas.toDataURL(),
      userAgent: navigator.userAgent.slice(0, 50)
    };
    
    return btoa(JSON.stringify(fingerprint)).slice(0, 32);
  }

  // Behavioral analysis
  static trackUserBehavior() {
    const behavior = {
      mouseMovements: 0,
      keystrokes: 0,
      clickPattern: [] as number[],
      sessionStart: Date.now()
    };

    document.addEventListener('mousemove', () => behavior.mouseMovements++);
    document.addEventListener('keydown', () => behavior.keystrokes++);
    document.addEventListener('click', () => behavior.clickPattern.push(Date.now()));

    return behavior;
  }

  // Risk assessment
  static calculateRiskScore(): number {
    const factors = {
      newDevice: localStorage.getItem('device_known') ? 0 : 30,
      timeOfDay: new Date().getHours() < 6 || new Date().getHours() > 22 ? 20 : 0,
      failedAttempts: parseInt(localStorage.getItem('failed_attempts') || '0') * 10,
      locationChange: 0 // Would check IP geolocation in production
    };

    return Math.min(Object.values(factors).reduce((a, b) => a + b, 0), 100);
  }

  // Anomaly detection
  static detectAnomalies(): string[] {
    const anomalies: string[] = [];
    const riskScore = this.calculateRiskScore();
    
    if (riskScore > 50) anomalies.push('High risk login detected');
    if (!localStorage.getItem('device_known')) anomalies.push('New device detected');
    
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) anomalies.push('Unusual login time');
    
    return anomalies;
  }
}