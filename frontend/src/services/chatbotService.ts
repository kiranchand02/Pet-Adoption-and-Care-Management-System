import { apiService } from './apiService';

interface ChatResponse {
  message: string;
  suggestions?: string[];
  confidence?: number;
  context?: string;
}

interface Intent {
  name: string;
  patterns: string[];
  responses: string[];
  context?: string;
  action?: string;
}

class AdvancedChatbotService {
  private medicalKnowledge = {
    // Vaccination schedules by species and age
    vaccineSchedules: {
      dog: {
        puppy: [
          { age: '6-8 weeks', vaccines: ['DHPP (1st dose)', 'Bordetella'], notes: 'Start core vaccine series' },
          { age: '10-12 weeks', vaccines: ['DHPP (2nd dose)', 'Rabies'], notes: 'Continue series, first rabies' },
          { age: '14-16 weeks', vaccines: ['DHPP (3rd dose)', 'Lyme (if applicable)'], notes: 'Complete puppy series' },
          { age: '1 year', vaccines: ['DHPP booster', 'Rabies booster'], notes: 'Annual boosters begin' }
        ],
        adult: [
          { age: 'Annual', vaccines: ['DHPP', 'Rabies'], notes: 'Yearly core vaccines' },
          { age: 'Every 3 years', vaccines: ['Rabies (3-year)'], notes: 'After initial series' }
        ]
      },
      cat: {
        kitten: [
          { age: '6-8 weeks', vaccines: ['FVRCP (1st dose)'], notes: 'Start core vaccine series' },
          { age: '10-12 weeks', vaccines: ['FVRCP (2nd dose)', 'Rabies'], notes: 'Continue series' },
          { age: '14-16 weeks', vaccines: ['FVRCP (3rd dose)', 'FeLV (if outdoor)'], notes: 'Complete kitten series' },
          { age: '1 year', vaccines: ['FVRCP booster', 'Rabies booster'], notes: 'Annual boosters' }
        ],
        adult: [
          { age: 'Annual', vaccines: ['FVRCP', 'Rabies'], notes: 'Yearly core vaccines' },
          { age: 'As needed', vaccines: ['FeLV', 'FIV test'], notes: 'For outdoor cats' }
        ]
      },
      bird: [
        { age: 'Annual', vaccines: ['Polyomavirus (if applicable)'], notes: 'Species-specific vaccines' },
        { age: 'Bi-annual', vaccines: ['Health checkup'], notes: 'Regular wellness exams' }
      ],
      rabbit: [
        { age: 'Annual', vaccines: ['RHDV2', 'Myxomatosis (if applicable)'], notes: 'Regional disease prevention' },
        { age: '6 months', vaccines: ['Spay/Neuter recommended'], notes: 'Reproductive health' }
      ]
    },

    // Common symptoms and medicine recommendations
    symptoms: {
      'vomiting': {
        mild: { medicine: 'Withhold food 12-24hrs, small water amounts', dosage: 'Monitor closely', when: 'If continues >24hrs, see vet' },
        severe: { medicine: 'EMERGENCY - See vet immediately', dosage: 'Do not medicate', when: 'Immediate veterinary care' }
      },
      'diarrhea': {
        mild: { medicine: 'Bland diet (rice + boiled chicken)', dosage: 'Small frequent meals', when: 'If persists >2 days, see vet' },
        severe: { medicine: 'Probiotics + vet consultation', dosage: 'As prescribed', when: 'Same day vet visit' }
      },
      'fever': {
        mild: { medicine: 'Cool compress, monitor temperature', dosage: 'Every 2 hours', when: 'If temp >103°F, see vet' },
        severe: { medicine: 'EMERGENCY - Immediate vet care', dosage: 'Do not give human medications', when: 'Immediate' }
      },
      'cough': {
        mild: { medicine: 'Honey (dogs only, 1 tsp)', dosage: '2-3 times daily', when: 'If persists >3 days' },
        severe: { medicine: 'Vet prescribed cough suppressant', dosage: 'As directed', when: 'Same day vet visit' }
      },
      'skin irritation': {
        mild: { medicine: 'Oatmeal bath, antihistamine', dosage: 'Bath 2x/week, Benadryl 1mg/lb', when: 'If worsens in 3 days' },
        severe: { medicine: 'Topical antibiotics + steroids', dosage: 'Vet prescribed only', when: 'Immediate vet care' }
      },
      'ear infection': {
        mild: { medicine: 'Ear cleaning solution', dosage: 'Daily cleaning', when: 'If no improvement in 2 days' },
        severe: { medicine: 'Antibiotic ear drops', dosage: 'As prescribed by vet', when: 'Vet consultation required' }
      },
      'eye discharge': {
        mild: { medicine: 'Saline eye wash', dosage: '2-3 times daily', when: 'If discharge increases' },
        severe: { medicine: 'Antibiotic eye drops', dosage: 'Vet prescribed', when: 'Same day vet visit' }
      },
      'lethargy': {
        mild: { medicine: 'Monitor, ensure hydration', dosage: 'Continuous observation', when: 'If continues >24hrs' },
        severe: { medicine: 'EMERGENCY - Blood work needed', dosage: 'No home treatment', when: 'Immediate vet care' }
      },
      'loss of appetite': {
        mild: { medicine: 'Offer favorite foods, warm slightly', dosage: 'Small frequent meals', when: 'If no eating >24hrs' },
        severe: { medicine: 'Force feeding may be needed - vet visit', dosage: 'Professional guidance', when: 'Same day vet care' }
      },
      'difficulty breathing': {
        mild: { medicine: 'EMERGENCY - Do not delay', dosage: 'Keep calm, transport immediately', when: 'Immediate vet care' },
        severe: { medicine: 'CRITICAL - Call ahead to vet', dosage: 'Oxygen may be needed', when: 'Emergency now' }
      },
      'seizure': {
        mild: { medicine: 'EMERGENCY - Time the seizure', dosage: 'Keep safe, do not restrain', when: 'Immediate vet care' },
        severe: { medicine: 'CRITICAL - Multiple seizures', dosage: 'Emergency medication needed', when: 'Call vet immediately' }
      }
    },

    // Preventive medications by species
    preventiveMeds: {
      dog: {
        heartworm: { medicine: 'Heartgard Plus', dosage: 'Monthly', timing: 'Year-round in most climates' },
        flea: { medicine: 'Frontline Plus', dosage: 'Monthly', timing: 'Flea season or year-round' },
        tick: { medicine: 'Nexgard', dosage: 'Monthly', timing: 'Tick season (spring-fall)' },
        deworming: { medicine: 'Panacur', dosage: 'Every 3-6 months', timing: 'Based on lifestyle' }
      },
      cat: {
        heartworm: { medicine: 'Revolution Plus', dosage: 'Monthly', timing: 'Year-round prevention' },
        flea: { medicine: 'Advantage II', dosage: 'Monthly', timing: 'As needed or preventive' },
        deworming: { medicine: 'Drontal', dosage: 'Every 3-6 months', timing: 'Regular prevention' }
      }
    }
  };

  private intents: Intent[] = [
    {
      name: 'greeting',
      patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      responses: [
        'Hello! I\'m your AI Pet Care Assistant. How can I help you today?',
        'Hi there! I\'m here to help with all your pet care questions.',
        'Welcome! I can assist you with pet care, adoption, and veterinary guidance.'
      ],
      context: 'greeting'
    },
    {
      name: 'medical_emergency',
      patterns: ['emergency', 'urgent', 'help my pet', 'dying', 'not breathing', 'seizure', 'bleeding'],
      responses: [
        '🚨 **EMERGENCY**: Please contact your nearest veterinary emergency clinic immediately! Call your vet or emergency hotline now. Do not delay medical treatment.'
      ],
      context: 'emergency'
    },
    {
      name: 'adoption_inquiry',
      patterns: ['adopt', 'adoption', 'get a pet', 'find a pet', 'available pets'],
      responses: [],
      action: 'handleAdoptionInquiry'
    },
    {
      name: 'medical_advice',
      patterns: ['sick', 'illness', 'symptoms', 'medicine', 'treatment', 'vet'],
      responses: [],
      action: 'handleMedicalAdvice'
    },
    {
      name: 'vaccination_info',
      patterns: ['vaccine', 'vaccination', 'shots', 'immunization'],
      responses: [],
      action: 'handleVaccinationInfo'
    },
    {
      name: 'pet_care',
      patterns: ['care', 'feeding', 'exercise', 'grooming', 'training'],
      responses: [],
      action: 'handlePetCare'
    },
    {
      name: 'database_query',
      patterns: ['how many', 'total', 'count', 'statistics', 'stats'],
      responses: [],
      action: 'handleDatabaseQuery'
    }
  ];

  async sendMessage(message: string, isAdmin: boolean = false): Promise<ChatResponse> {
    // Fast response - no artificial delays
    const processedMessage = this.preprocessMessage(message);
    const intent = this.classifyIntent(processedMessage);
    const entities = this.extractEntities(processedMessage);
    
    // Quick pattern matching for instant responses
    const quickResponse = this.getQuickResponse(processedMessage, entities);
    if (quickResponse) return quickResponse;
    
    return await this.generateResponse(intent, entities, processedMessage, isAdmin);
  }

  private getQuickResponse(message: string, entities: { [key: string]: string }): ChatResponse | null {
    const context = this.analyzeMessageContext(message, entities);
    
    // Advanced pattern matching with medical accuracy
    if (message.includes('vomit') || message.includes('throw up')) {
      return this.generateVomitingResponse(context);
    }
    if (message.includes('diarrhea') || message.includes('loose stool')) {
      return this.generateDiarrheaResponse(context);
    }
    if (message.includes('emergency') || message.includes('urgent')) {
      return this.generateEmergencyResponse();
    }
    if (message.includes('vaccine') || message.includes('shot')) {
      return this.generateVaccineResponse(context);
    }
    if (message.includes('adopt') || message.includes('available pets')) {
      return this.generateAdoptionResponse(context);
    }
    if (message.includes('hello') || message.includes('hi')) {
      return this.generateGreeting();
    }
    
    return null;
  }

  private analyzeMessageContext(message: string, entities: { [key: string]: string }): any {
    return {
      species: entities.species || this.detectSpecies(message),
      urgency: this.detectUrgency(message),
      duration: this.detectDuration(message)
    };
  }

  private detectUrgency(message: string): string {
    if (['emergency', 'dying', 'blood', 'seizure'].some(word => message.includes(word))) return 'high';
    if (['sick', 'pain', 'vomiting'].some(word => message.includes(word))) return 'medium';
    return 'low';
  }

  private detectSpecies(message: string): string {
    if (message.includes('dog') || message.includes('puppy')) return 'dog';
    if (message.includes('cat') || message.includes('kitten')) return 'cat';
    return 'pet';
  }

  private detectDuration(message: string): string {
    if (message.includes('days')) return 'days';
    if (message.includes('hours')) return 'hours';
    return 'unknown';
  }

  private generateVomitingResponse(context: any): ChatResponse {
    return {
      message: `**VOMITING PROTOCOL - ${context.species.toUpperCase()}**\n\n🔬 **Immediate Assessment:**\n• Withhold food 12-24 hours\n• Small water amounts every 2 hours\n• Monitor for dehydration\n\n⚠️ **Emergency Indicators:**\n• Blood in vomit\n• Projectile vomiting\n• Lethargy or weakness\n• Continues >24 hours\n\n📋 **Recovery Plan:**\n• Bland diet: rice + boiled chicken\n• Small frequent meals\n• Gradual food reintroduction`,
      suggestions: ['Dehydration signs', 'Bland diet guide', 'Emergency care', 'Follow-up'],
      confidence: 0.95
    };
  }

  private generateDiarrheaResponse(context: any): ChatResponse {
    return {
      message: `**DIARRHEA MANAGEMENT - ${context.species.toUpperCase()}**\n\n🔬 **Treatment Protocol:**\n• Maintain hydration\n• Bland diet (rice + chicken)\n• Probiotics if available\n• Monitor stool consistency\n\n⚠️ **Veterinary Care If:**\n• Blood or mucus present\n• Fever or dehydration\n• Persists >48 hours\n• Severe lethargy\n\n📋 **Dietary Management:**\n• Small frequent meals\n• Avoid dairy and fats\n• Gradual diet transition`,
      suggestions: ['Hydration test', 'Probiotic options', 'Diet plan', 'Warning signs'],
      confidence: 0.95
    };
  }

  private generateEmergencyResponse(): ChatResponse {
    return {
      message: `🚨 **EMERGENCY VETERINARY PROTOCOL**\n\n📞 **IMMEDIATE CONTACT:**\n• Your Veterinarian: [Call Now]\n• Emergency Hotline: 1-800-VET-HELP\n• Poison Control: 1-888-426-4435\n\n🚑 **Critical Transport:**\n• Keep pet calm and stable\n• Bring medical records\n• Note symptom timeline\n\n⚠️ **Emergency Indicators:**\n• Difficulty breathing\n• Loss of consciousness\n• Severe bleeding\n• Seizure activity`,
      suggestions: ['First aid', 'Emergency vets', 'Transport guide', 'Poison help'],
      confidence: 1.0
    };
  }

  private generateVaccineResponse(context: any): ChatResponse {
    return {
      message: `**VACCINATION SCHEDULE - ${context.species.toUpperCase()}**\n\n💉 **Core Vaccines:**\n• DHPP/FVRCP (species-specific)\n• Rabies vaccination\n• Age-appropriate boosters\n\n📅 **Schedule:**\n• Puppy/Kitten: 6-16 weeks\n• Adult: Annual boosters\n• Senior: Vet consultation\n\n🏥 **Pre-Vaccination:**\n• Health examination\n• Deworming status\n• Lifestyle assessment`,
      suggestions: ['Schedule appointment', 'Vaccine costs', 'Side effects', 'Booster timing'],
      confidence: 0.9
    };
  }

  private generateAdoptionResponse(context: any): ChatResponse {
    return {
      message: `**PET ADOPTION SERVICES**\n\n🏠 **Available Options:**\n• Dogs: Various breeds and ages\n• Cats: Indoor/outdoor preferences\n• Small pets: Rabbits, birds\n• Senior pets: Special needs\n\n📋 **Adoption Process:**\n• Application submission\n• Meet and greet\n• Home assessment\n• Adoption finalization\n\n💝 **Matching Service:**\n• Lifestyle compatibility\n• Experience level\n• Housing requirements`,
      suggestions: ['View available pets', 'Application form', 'Requirements', 'Schedule visit'],
      confidence: 0.9
    };
  }

  private generateGreeting(): ChatResponse {
    return {
      message: `**Professional Veterinary AI Assistant**\n\nProviding evidence-based medical guidance and comprehensive pet care services.\n\n🔬 **Clinical Services:**\n• Symptom analysis and diagnosis\n• Treatment protocols\n• Emergency guidance\n• Vaccination scheduling\n\n🏠 **Adoption Services:**\n• Pet matching algorithms\n• Behavioral assessments\n• Care requirements\n\nHow may I assist you today?`,
      suggestions: ['Health consultation', 'Available pets', 'Emergency help', 'Vaccination info'],
      confidence: 0.9
    };
  }

  private preprocessMessage(message: string): string {
    return message.toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private classifyIntent(message: string): Intent {
    let bestMatch: Intent | null = null;
    let highestScore = 0;
    
    for (const intent of this.intents) {
      const score = this.calculateIntentScore(message, intent.patterns);
      if (score > highestScore && score > 0.3) {
        highestScore = score;
        bestMatch = intent;
      }
    }
    
    return bestMatch || {
      name: 'unknown',
      patterns: [],
      responses: ['I\'m not sure I understand. Could you please rephrase your question?']
    };
  }

  private calculateIntentScore(message: string, patterns: string[]): number {
    let maxScore = 0;
    
    for (const pattern of patterns) {
      const score = this.fuzzyMatch(message, pattern);
      maxScore = Math.max(maxScore, score);
    }
    
    return maxScore;
  }

  private fuzzyMatch(text: string, pattern: string): number {
    const words = text.split(' ');
    const patternWords = pattern.split(' ');
    let matches = 0;
    
    for (const patternWord of patternWords) {
      for (const word of words) {
        if (word.includes(patternWord) || patternWord.includes(word)) {
          matches++;
          break;
        }
      }
    }
    
    return matches / patternWords.length;
  }

  private extractEntities(message: string): { [key: string]: string } {
    const entities: { [key: string]: string } = {};
    
    // Extract species
    const species = ['dog', 'cat', 'bird', 'rabbit', 'fish', 'hedgehog', 'guinea pig', 'ferret', 'pig'];
    for (const s of species) {
      if (message.includes(s)) {
        entities.species = s;
        break;
      }
    }
    
    // Extract age
    const agePatterns = ['puppy', 'kitten', 'young', 'adult', 'senior', 'old'];
    for (const age of agePatterns) {
      if (message.includes(age)) {
        entities.age = age;
        break;
      }
    }
    
    // Extract symptoms
    const symptoms = Object.keys(this.medicalKnowledge.symptoms);
    for (const symptom of symptoms) {
      if (message.includes(symptom)) {
        entities.symptom = symptom;
        break;
      }
    }
    
    return entities;
  }

  private async generateResponse(intent: Intent, entities: { [key: string]: string }, message: string, isAdmin: boolean): Promise<ChatResponse> {
    if (intent.action) {
      switch (intent.action) {
        case 'handleAdoptionInquiry':
          return await this.handleAdoptionInquiry(entities, message);
        case 'handleMedicalAdvice':
          return this.handleMedicalAdvice(entities, message);
        case 'handleVaccinationInfo':
          return this.handleVaccinationInfo(entities, message);
        case 'handlePetCare':
          return this.handlePetCare(entities, message);
        case 'handleDatabaseQuery':
          return await this.handleDatabaseQuery(message, isAdmin);
        default:
          return this.getRandomResponse(intent);
      }
    }
    
    return this.getRandomResponse(intent);
  }

  private getRandomResponse(intent: Intent): ChatResponse {
    const response = intent.responses[Math.floor(Math.random() * intent.responses.length)];
    return {
      message: response,
      suggestions: this.getContextualSuggestions(intent.name),
      confidence: 0.9
    };
  }

  private getContextualSuggestions(intentName: string): string[] {
    const suggestionMap: { [key: string]: string[] } = {
      greeting: ['Available pets', 'Adoption process', 'Pet care tips', 'Health advice'],
      medical_emergency: ['Find emergency vet', 'First aid tips', 'Emergency contacts'],
      adoption_inquiry: ['View available pets', 'Adoption requirements', 'Application process'],
      medical_advice: ['Vaccination schedule', 'Emergency symptoms', 'Preventive care'],
      vaccination_info: ['Puppy vaccines', 'Cat vaccines', 'Adult pet boosters'],
      pet_care: ['Feeding guide', 'Exercise tips', 'Grooming advice', 'Training help'],
      unknown: ['Pet care basics', 'Adoption info', 'Health questions', 'Available pets']
    };
    
    return suggestionMap[intentName] || suggestionMap.unknown;
  }

  private async handleAdoptionInquiry(entities: { [key: string]: string }, message: string): Promise<ChatResponse> {
    try {
      const pets = await apiService.listPets();
      const availablePets = pets.filter(p => p.current_status === 'Available');
      
      if (entities.species) {
        const speciesPets = availablePets.filter(p => p.species.toLowerCase() === entities.species);
        if (speciesPets.length > 0) {
          return {
            message: `Great choice! We have ${speciesPets.length} ${entities.species}s available for adoption. Here are some options:\n\n${speciesPets.slice(0, 3).map(p => `🐾 **${p.name}** - ${p.breed}, ${p.age} years old`).join('\n')}\n\nWould you like to know more about any of these pets or learn about our adoption process?`,
            suggestions: ['Adoption requirements', 'Schedule visit', 'Pet care tips', `More ${entities.species}s`],
            confidence: 0.95
          };
        }
      }
      
      return {
        message: `We currently have ${availablePets.length} wonderful pets available for adoption! Our pets include dogs, cats, birds, rabbits, and other amazing animals. Each pet is health-checked, vaccinated, and ready for their forever home.\n\n🏠 **Adoption Process:**\n1. Browse available pets\n2. Submit application\n3. Meet & greet\n4. Home visit (if needed)\n5. Finalize adoption\n\nWhat type of pet are you interested in?`,
        suggestions: ['Dogs available', 'Cats available', 'Other pets', 'Adoption requirements'],
        confidence: 0.9
      };
    } catch (error) {
      return {
        message: "I'd love to help you find the perfect pet! Please visit our Pet Management section to see all available animals, or let me know what type of pet you're looking for.",
        suggestions: ['Dog adoption', 'Cat adoption', 'Adoption process', 'Pet care guide']
      };
    }
  }

  private handleMedicalAdvice(entities: { [key: string]: string }, message: string): ChatResponse {
    if (entities.symptom && entities.symptom in this.medicalKnowledge.symptoms) {
      const symptomInfo = this.medicalKnowledge.symptoms[entities.symptom as keyof typeof this.medicalKnowledge.symptoms];
      const severity = message.includes('severe') || message.includes('emergency') ? 'severe' : 'mild';
      const treatment = (symptomInfo as any)[severity] || (symptomInfo as any).mild;
      
      const species = entities.species || 'pets';
      
      return {
        message: `**${entities.symptom.toUpperCase()} in ${species.toUpperCase()}**\n\n🏥 **Recommended Treatment:**\n${treatment.medicine}\n\n💊 **Dosage/Instructions:**\n${treatment.dosage}\n\n⏰ **When to see vet:**\n${treatment.when}\n\n⚠️ **Important:** This is general guidance only. Always consult your veterinarian for proper diagnosis and treatment, especially for persistent or severe symptoms.`,
        suggestions: ['Emergency symptoms', 'Find a vet', 'Preventive care', 'Vaccination info'],
        confidence: 0.9
      };
    }
    
    return {
      message: "I can help with common pet health concerns. Please describe the specific symptoms you're observing (e.g., 'my dog is vomiting', 'cat has diarrhea', 'bird seems lethargic'). For emergencies, contact your vet immediately!",
      suggestions: ['Common symptoms', 'Emergency signs', 'Preventive care', 'Find a vet'],
      confidence: 0.7
    };
  }

  private handleVaccinationInfo(entities: { [key: string]: string }, message: string): ChatResponse {
    const species = entities.species || 'dog';
    const age = entities.age || 'adult';
    
    if (species in this.medicalKnowledge.vaccineSchedules) {
      const schedule = this.medicalKnowledge.vaccineSchedules[species as keyof typeof this.medicalKnowledge.vaccineSchedules];
      let response = `**${species.toUpperCase()} VACCINATION SCHEDULE**\n\n`;
      
      const ageCategory = (age === 'puppy' || age === 'kitten' || age === 'young') ? 'young' : 'adult';
      const relevantSchedule = (schedule as any)[ageCategory] || (schedule as any).adult || schedule;
      
      if (Array.isArray(relevantSchedule)) {
        relevantSchedule.forEach((item: any) => {
          response += `📅 **${item.age}**: ${item.vaccines.join(', ')}\n   ℹ️ ${item.notes}\n\n`;
        });
      }
      
      response += "🩺 **Professional Advice:** Consult your veterinarian for a personalized vaccination schedule based on your pet's health, lifestyle, and local disease risks.";
      
      return {
        message: response,
        suggestions: ['Vaccine costs', 'Side effects', 'Booster schedule', 'Find a vet'],
        confidence: 0.95
      };
    }
    
    return {
      message: "I can provide vaccination schedules for dogs, cats, birds, and rabbits. Please specify the species and age (e.g., 'puppy vaccination schedule', 'adult cat vaccines').",
      suggestions: ['Dog vaccines', 'Cat vaccines', 'Puppy schedule', 'Adult boosters']
    };
  }

  private handlePetCare(entities: { [key: string]: string }, message: string): ChatResponse {
    const species = entities.species || 'pets';
    
    const careAdvice = {
      feeding: `**FEEDING GUIDE for ${species.toUpperCase()}**\n\n🍽️ **Basics:**\n• High-quality food appropriate for species, age, and size\n• Regular feeding schedule (2-3 times daily for most pets)\n• Fresh water always available\n• Avoid human food that can be toxic\n\n📏 **Portions:** Follow feeding guidelines on food packaging, adjust based on activity level and body condition.`,
      exercise: `**EXERCISE NEEDS for ${species.toUpperCase()}**\n\n🏃 **Daily Activity:**\n• Dogs: 30min-2hrs depending on breed\n• Cats: 10-15min interactive play sessions\n• Birds: Flight time outside cage\n• Rabbits: 3-4hrs supervised exercise\n\n🎾 **Activities:** Walking, playing, mental stimulation through toys and training.`,
      grooming: `**GROOMING ESSENTIALS for ${species.toUpperCase()}**\n\n✂️ **Regular Care:**\n• Brushing: Daily for long-haired, weekly for short-haired\n• Nail trimming: Every 2-4 weeks\n• Dental care: Daily brushing or dental chews\n• Bathing: As needed (monthly for most pets)\n\n🧼 **Professional grooming** recommended every 6-8 weeks for some breeds.`
    };
    
    for (const [topic, advice] of Object.entries(careAdvice)) {
      if (message.includes(topic)) {
        return {
          message: advice,
          suggestions: ['Health checkups', 'Training tips', 'Behavioral advice', 'Emergency care'],
          confidence: 0.9
        };
      }
    }
    
    return {
      message: `**GENERAL PET CARE for ${species.toUpperCase()}**\n\n🏠 **Essential Care:**\n• Proper nutrition and fresh water\n• Regular exercise and mental stimulation\n• Routine veterinary checkups\n• Safe, comfortable living environment\n• Love, attention, and socialization\n\n💡 **Tip:** Each species has unique needs. What specific aspect of care would you like to know more about?`,
      suggestions: ['Feeding guide', 'Exercise needs', 'Grooming tips', 'Health care'],
      confidence: 0.8
    };
  }

  private async handleDatabaseQuery(message: string, isAdmin: boolean): Promise<ChatResponse> {
    try {
      const [pets, adopters, applications] = await Promise.all([
        apiService.listPets(),
        apiService.listAdopters(),
        apiService.listApplicationsByStatus()
      ]);

      if (message.includes('pets') || message.includes('animals')) {
        const available = pets.filter(p => p.current_status === 'Available').length;
        const adopted = pets.filter(p => p.current_status === 'Adopted').length;
        
        return {
          message: `We currently have ${pets.length} total pets in our system. ${available} are available for adoption and ${adopted} have been successfully adopted. We care for dogs, cats, birds, rabbits, and other wonderful animals!`,
          suggestions: ['Available dogs', 'Cat adoption process', 'Pet care tips', 'Vaccination schedule']
        };
      }
      
      if (message.includes('adopters') || message.includes('families')) {
        return {
          message: `We have ${adopters.length} registered adopters in our system. These are wonderful families and individuals looking to provide loving homes for our pets.`,
          suggestions: ['Adoption requirements', 'Application process', 'Pet matching', 'Home visit info']
        };
      }
      
      if (message.includes('applications')) {
        const pending = applications.filter(a => a.status === 'Application').length;
        return {
          message: `There are currently ${applications.length} total adoption applications, with ${pending} pending review. ${isAdmin ? 'You can review these in the Adoption Workflow section.' : 'Our team reviews applications within 2-3 business days.'}`,
          suggestions: ['Application status', 'Adoption timeline', 'Required documents', 'Interview process']
        };
      }
      
    } catch (error) {
      console.error('Database query error:', error);
    }
    
    return {
      message: "I can help you with information about our pets, adoption process, and pet care. What would you like to know?",
      suggestions: ['Available pets', 'Adoption process', 'Pet care tips', 'Health advice']
    };
  }

  private async handlePetQuery(message: string): Promise<ChatResponse> {
    try {
      const pets = await apiService.listPets();
      const availablePets = pets.filter(p => p.current_status === 'Available');
      
      if (message.includes('dog')) {
        const dogs = availablePets.filter(p => p.species === 'Dog');
        return {
          message: `We have ${dogs.length} wonderful dogs available for adoption! They include breeds like ${dogs.slice(0, 3).map(d => d.breed).join(', ')}. Dogs make loyal companions and need daily exercise, training, and lots of love.`,
          suggestions: ['Dog care tips', 'Training advice', 'Exercise needs', 'Apply for dog adoption']
        };
      }
      
      if (message.includes('cat')) {
        const cats = availablePets.filter(p => p.species === 'Cat');
        return {
          message: `We have ${cats.length} adorable cats ready for adoption! Cats are independent yet affectionate pets that make wonderful companions. They need clean litter boxes, quality food, and mental stimulation.`,
          suggestions: ['Cat care guide', 'Litter training', 'Indoor safety', 'Apply for cat adoption']
        };
      }
      
      return {
        message: `We have ${availablePets.length} pets available for adoption across various species including dogs, cats, birds, and rabbits. Each pet has been health-checked and is ready for their forever home!`,
        suggestions: ['View all pets', 'Species information', 'Adoption requirements', 'Schedule visit']
      };
      
    } catch (error) {
      console.error('Pet query error:', error);
      return {
        message: "I'd be happy to help you learn about our available pets! Please check our Pet Management section for the most current information.",
        suggestions: ['Pet care tips', 'Adoption process', 'Health advice', 'Species guide']
      };
    }
  }

  private isMedicalQuery(message: string): boolean {
    const medicalKeywords = ['sick', 'vomiting', 'diarrhea', 'fever', 'cough', 'medicine', 'treatment', 'symptoms', 'ear infection', 'eye discharge', 'lethargy', 'skin irritation'];
    return medicalKeywords.some(keyword => message.includes(keyword));
  }

  private isVaccinationQuery(message: string): boolean {
    const vaccineKeywords = ['vaccine', 'vaccination', 'shot', 'immunization', 'rabies', 'dhpp', 'fvrcp'];
    return vaccineKeywords.some(keyword => message.includes(keyword));
  }

  private handleMedicalQuery(message: string): ChatResponse {
    // Extract species and symptom
    const species = this.extractSpecies(message);
    const symptom = this.extractSymptom(message);
    
    if (symptom && symptom in this.medicalKnowledge.symptoms) {
      const symptomInfo = (this.medicalKnowledge.symptoms as any)[symptom];
      const severity = message.includes('severe') || message.includes('bad') || message.includes('emergency') ? 'severe' : 'mild';
      const treatment = symptomInfo[severity] || symptomInfo.mild;
      
      return {
        message: `For ${symptom} in ${species || 'pets'}:\n\n🏥 **Treatment**: ${treatment.medicine}\n💊 **Dosage**: ${treatment.dosage}\n⏰ **When to see vet**: ${treatment.when}\n\n⚠️ **Important**: This is general guidance. Always consult your veterinarian for proper diagnosis and treatment.`,
        suggestions: ['Vaccination schedule', 'Preventive care', 'Emergency symptoms', 'Find nearest vet']
      };
    }
    
    return {
      message: "I can help with common pet health issues. Please describe the symptoms you're observing (e.g., 'my dog is vomiting', 'cat has diarrhea', 'bird seems lethargic').",
      suggestions: ['Vomiting treatment', 'Diarrhea care', 'Fever management', 'Skin irritation']
    };
  }

  private handleVaccinationQuery(message: string): ChatResponse {
    const species = this.extractSpecies(message);
    const age = this.extractAge(message);
    
    if (species && species in this.medicalKnowledge.vaccineSchedules) {
      const schedule = (this.medicalKnowledge.vaccineSchedules as any)[species];
      let response = `**${species.toUpperCase()} Vaccination Schedule:**\n\n`;
      
      if (age === 'puppy' || age === 'kitten') {
        const youngSchedule = schedule[age] || schedule.puppy || schedule.kitten;
        if (youngSchedule) {
          youngSchedule.forEach((item: any) => {
            response += `🗓️ **${item.age}**: ${item.vaccines.join(', ')}\n   📝 ${item.notes}\n\n`;
          });
        }
      } else {
        const adultSchedule = schedule.adult || schedule;
        if (Array.isArray(adultSchedule)) {
          adultSchedule.forEach((item: any) => {
            response += `🗓️ **${item.age}**: ${item.vaccines.join(', ')}\n   📝 ${item.notes}\n\n`;
          });
        }
      }
      
      response += "⚠️ **Note**: Consult your veterinarian for personalized vaccination schedule based on your pet's health and lifestyle.";
      
      return {
        message: response,
        suggestions: ['Preventive medications', 'Health checkup schedule', 'Vaccine side effects', 'Cost of vaccines']
      };
    }
    
    return {
      message: "I can provide vaccination schedules for dogs, cats, birds, and rabbits. Please specify the species and age (e.g., 'puppy vaccination schedule', 'adult cat vaccines').",
      suggestions: ['Dog vaccines', 'Cat vaccines', 'Bird vaccines', 'Rabbit vaccines']
    };
  }

  private extractSpecies(message: string): string {
    const speciesMap = { dog: 'dog', puppy: 'dog', cat: 'cat', kitten: 'cat', bird: 'bird', rabbit: 'rabbit' };
    for (const [key, value] of Object.entries(speciesMap)) {
      if (message.includes(key)) return value;
    }
    return '';
  }

  private extractSymptom(message: string): string {
    const symptoms = Object.keys(this.medicalKnowledge.symptoms);
    return symptoms.find(symptom => message.includes(symptom)) || '';
  }

  private extractAge(message: string): string {
    if (message.includes('puppy') || message.includes('kitten') || message.includes('young')) return 'puppy';
    if (message.includes('adult') || message.includes('grown')) return 'adult';
    return 'adult';
  }

  private generatePetCareResponse(message: string): ChatResponse | null {
    const basicCare = {
      'care': 'Proper pet care includes regular feeding, exercise, grooming, and veterinary checkups. Each species has specific needs.',
      'feeding': 'Feed pets high-quality food appropriate for their species, age, and size. Maintain regular feeding schedules.',
      'exercise': 'Dogs need daily walks and playtime. Cats benefit from interactive toys. Exercise needs vary by species and age.',
      'grooming': 'Regular brushing prevents matting and reduces shedding. Nail trimming and dental care are also important.',
    };
    
    for (const [keyword, response] of Object.entries(basicCare)) {
      if (message.includes(keyword)) {
        return {
          message: response,
          suggestions: this.getRelatedSuggestions(keyword)
        };
      }
    }
    return null;
  }

  private getRelatedSuggestions(keyword: string): string[] {
    const suggestionMap: { [key: string]: string[] } = {
      'care': ['Feeding schedule', 'Exercise needs', 'Grooming tips', 'Health checkups'],
      'feeding': ['Nutrition guide', 'Feeding schedule', 'Food allergies', 'Treats and snacks'],
      'vaccination': ['Vaccine schedule', 'Core vaccines', 'Booster shots', 'Vaccine reactions'],
      'health': ['Emergency signs', 'Preventive care', 'Senior pet care', 'Dental health'],
      'adoption': ['Application process', 'Home requirements', 'Pet matching', 'Adoption fees'],
      'dog': ['Dog training', 'Exercise needs', 'Socialization', 'Breed information'],
      'cat': ['Litter training', 'Indoor enrichment', 'Scratching behavior', 'Cat health'],
    };
    
    return suggestionMap[keyword] || ['Pet care tips', 'Health advice', 'Adoption info', 'Species guide'];
  }

  private generateContextualResponse(message: string, isAdmin: boolean): ChatResponse {
    const responses = [
      {
        message: "I'm here to help with pet care questions, adoption information, and general guidance about animal welfare. What specific topic interests you?",
        suggestions: ['Pet nutrition', 'Behavioral issues', 'Adoption process', 'Emergency care']
      },
      {
        message: "As your AI pet care assistant, I can provide advice on pet health, behavior, nutrition, and our adoption services. How can I assist you today?",
        suggestions: ['Health concerns', 'Training tips', 'Available pets', 'Veterinary care']
      },
      {
        message: "I have extensive knowledge about pet care across different species. Whether you're a current pet owner or considering adoption, I'm here to help!",
        suggestions: ['Species comparison', 'Care requirements', 'Adoption matching', 'Health monitoring']
      }
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    if (isAdmin) {
      randomResponse.suggestions.push('System statistics', 'Shelter management');
    }
    
    return randomResponse;
  }
}

export const chatbotService = new AdvancedChatbotService();