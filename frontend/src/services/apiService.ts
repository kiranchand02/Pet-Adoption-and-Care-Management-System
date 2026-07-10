import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store pets in memory for this session
let petsDatabase = [
  { pet_id: 1, name: 'Buddy', species: 'Dog', breed: 'Golden Retriever', age: 3, gender: 'Male', health_status: 'Healthy', rescue_date: '2024-01-15', current_status: 'Available', shelter_name: 'Happy Paws Shelter' },
  { pet_id: 2, name: 'Whiskers', species: 'Cat', breed: 'Persian', age: 2, gender: 'Female', health_status: 'Needs vaccination', rescue_date: '2024-02-10', current_status: 'Available', shelter_name: 'Happy Paws Shelter' },
  { pet_id: 3, name: 'Max', species: 'Dog', breed: 'German Shepherd', age: 5, gender: 'Male', health_status: 'Healthy', rescue_date: '2024-01-20', current_status: 'Adopted', shelter_name: 'Animal Haven' },
  { pet_id: 4, name: 'Luna', species: 'Cat', breed: 'Siamese', age: 1, gender: 'Female', health_status: 'Healthy', rescue_date: '2024-03-01', current_status: 'Available', shelter_name: 'Happy Paws Shelter' },
  { pet_id: 5, name: 'Charlie', species: 'Dog', breed: 'Labrador', age: 4, gender: 'Male', health_status: 'Healthy', rescue_date: '2024-02-20', current_status: 'Adopted', shelter_name: 'Animal Haven' },
  { pet_id: 6, name: 'Mittens', species: 'Cat', breed: 'Maine Coon', age: 3, gender: 'Female', health_status: 'Spayed, healthy', rescue_date: '2024-01-25', current_status: 'Available', shelter_name: 'Rescue Paradise' },
  { pet_id: 7, name: 'Rex', species: 'Dog', breed: 'Bulldog', age: 6, gender: 'Male', health_status: 'Arthritis treatment', rescue_date: '2024-02-05', current_status: 'Under Care', shelter_name: 'Happy Paws Shelter' },
  { pet_id: 8, name: 'Bella', species: 'Dog', breed: 'Beagle', age: 2, gender: 'Female', health_status: 'Healthy', rescue_date: '2024-03-10', current_status: 'Available', shelter_name: 'Furry Friends Sanctuary' },
  { pet_id: 9, name: 'Shadow', species: 'Cat', breed: 'British Shorthair', age: 7, gender: 'Male', health_status: 'Senior care needed', rescue_date: '2024-01-30', current_status: 'Available', shelter_name: 'Animal Haven' },
  { pet_id: 10, name: 'Daisy', species: 'Rabbit', breed: 'Holland Lop', age: 1, gender: 'Female', health_status: 'Healthy', rescue_date: '2024-03-05', current_status: 'Available', shelter_name: 'Rescue Paradise' },
  { pet_id: 11, name: 'Tweety', species: 'Bird', breed: 'Canary', age: 2, gender: 'Male', health_status: 'Healthy', rescue_date: '2024-02-15', current_status: 'Available', shelter_name: 'Furry Friends Sanctuary' },
  { pet_id: 12, name: 'Coco', species: 'Bird', breed: 'Cockatiel', age: 3, gender: 'Female', health_status: 'Healthy', rescue_date: '2024-03-12', current_status: 'Adopted', shelter_name: 'Paws & Hearts Shelter' },
  { pet_id: 13, name: 'Snowball', species: 'Rabbit', breed: 'Angora', age: 2, gender: 'Male', health_status: 'Needs grooming', rescue_date: '2024-02-28', current_status: 'Available', shelter_name: 'Paws & Hearts Shelter' },
  { pet_id: 14, name: 'Ginger', species: 'Cat', breed: 'Orange Tabby', age: 4, gender: 'Female', health_status: 'Healthy', rescue_date: '2024-01-18', current_status: 'Adopted', shelter_name: 'Safe Haven Animal Rescue' },
  { pet_id: 15, name: 'Rocky', species: 'Dog', breed: 'Rottweiler', age: 5, gender: 'Male', health_status: 'Healthy', rescue_date: '2024-02-22', current_status: 'Available', shelter_name: 'Safe Haven Animal Rescue' },
  { pet_id: 16, name: 'Patches', species: 'Cat', breed: 'Calico', age: 3, gender: 'Female', health_status: 'Healthy', rescue_date: '2024-03-08', current_status: 'Available', shelter_name: 'Happy Paws Shelter' },
  { pet_id: 17, name: 'Buster', species: 'Dog', breed: 'Jack Russell', age: 2, gender: 'Male', health_status: 'High energy, healthy', rescue_date: '2024-03-15', current_status: 'Available', shelter_name: 'Animal Haven' },
  { pet_id: 18, name: 'Fluffy', species: 'Rabbit', breed: 'Lionhead', age: 1, gender: 'Female', health_status: 'Healthy', rescue_date: '2024-03-20', current_status: 'Available', shelter_name: 'Rescue Paradise' },
  { pet_id: 19, name: 'Polly', species: 'Bird', breed: 'Parakeet', age: 1, gender: 'Female', health_status: 'Young, healthy', rescue_date: '2024-03-18', current_status: 'Available', shelter_name: 'Furry Friends Sanctuary' },
  { pet_id: 20, name: 'Oreo', species: 'Cat', breed: 'Tuxedo', age: 2, gender: 'Male', health_status: 'Neutered, healthy', rescue_date: '2024-02-12', current_status: 'Adopted', shelter_name: 'Paws & Hearts Shelter' },
  { pet_id: 21, name: 'Zeus', species: 'Dog', breed: 'Great Dane', age: 4, gender: 'Male', health_status: 'Healthy giant', rescue_date: '2024-01-28', current_status: 'Available', shelter_name: 'Safe Haven Animal Rescue' },
  { pet_id: 22, name: 'Nemo', species: 'Fish', breed: 'Goldfish', age: 1, gender: 'Unknown', health_status: 'Healthy', rescue_date: '2024-03-22', current_status: 'Available', shelter_name: 'Happy Paws Shelter' },
  { pet_id: 23, name: 'Spike', species: 'Hedgehog', breed: 'African Pygmy', age: 2, gender: 'Male', health_status: 'Healthy', rescue_date: '2024-03-25', current_status: 'Available', shelter_name: 'Animal Haven' },
  { pet_id: 24, name: 'Princess', species: 'Guinea Pig', breed: 'Peruvian', age: 1, gender: 'Female', health_status: 'Healthy', rescue_date: '2024-03-28', current_status: 'Available', shelter_name: 'Rescue Paradise' },
  { pet_id: 25, name: 'Bandit', species: 'Ferret', breed: 'Domestic', age: 3, gender: 'Male', health_status: 'Playful, healthy', rescue_date: '2024-03-30', current_status: 'Available', shelter_name: 'Furry Friends Sanctuary' },
  { pet_id: 26, name: 'Rosie', species: 'Pig', breed: 'Pot-bellied', age: 2, gender: 'Female', health_status: 'Healthy', rescue_date: '2024-04-01', current_status: 'Available', shelter_name: 'Paws & Hearts Shelter' }
];

// Store applications in memory for this session
let applicationsDatabase = [
  { adoption_id: 1, status: 'Completed', application_date: '2024-03-01', pet_name: 'Max', pet_species: 'Dog', adopter_name: 'John Smith', adopter_contact: 'phone: 555-1234' },
  { adoption_id: 2, status: 'Application', application_date: '2024-03-15', pet_name: 'Buddy', pet_species: 'Dog', adopter_name: 'Sarah Johnson', adopter_contact: 'phone: 555-5678' },
  { adoption_id: 3, status: 'Approved', application_date: '2024-03-18', pet_name: 'Charlie', pet_species: 'Dog', adopter_name: 'Mike Wilson', adopter_contact: 'phone: 555-9876' },
  { adoption_id: 4, status: 'Completed', application_date: '2024-03-20', pet_name: 'Coco', pet_species: 'Bird', adopter_name: 'Lisa Chen', adopter_contact: 'phone: 555-4321' },
  { adoption_id: 5, status: 'Completed', application_date: '2024-03-22', pet_name: 'Ginger', pet_species: 'Cat', adopter_name: 'David Brown', adopter_contact: 'phone: 555-8765' },
  { adoption_id: 6, status: 'Approved', application_date: '2024-03-25', pet_name: 'Oreo', pet_species: 'Cat', adopter_name: 'Emma Davis', adopter_contact: 'phone: 555-2468' },
  { adoption_id: 7, status: 'Under Verification', application_date: '2024-03-28', pet_name: 'Bella', pet_species: 'Dog', adopter_name: 'Robert Taylor', adopter_contact: 'phone: 555-1357' },
  { adoption_id: 8, status: 'Application', application_date: '2024-03-30', pet_name: 'Patches', pet_species: 'Cat', adopter_name: 'Jennifer White', adopter_contact: 'phone: 555-9753' },
  { adoption_id: 9, status: 'Completed', application_date: '2024-04-02', pet_name: 'Zeus', pet_species: 'Dog', adopter_name: 'Kevin Martinez', adopter_contact: 'phone: 555-8642' },
  { adoption_id: 10, status: 'Application', application_date: '2024-04-05', pet_name: 'Tweety', pet_species: 'Bird', adopter_name: 'Amanda Garcia', adopter_contact: 'phone: 555-7531' },
  { adoption_id: 11, status: 'Application', application_date: '2024-04-08', pet_name: 'Whiskers', pet_species: 'Cat', adopter_name: 'John Smith', adopter_contact: 'phone: 555-1234' },
  { adoption_id: 12, status: 'Under Verification', application_date: '2024-04-10', pet_name: 'Luna', pet_species: 'Cat', adopter_name: 'Mike Wilson', adopter_contact: 'phone: 555-9876' },
  { adoption_id: 13, status: 'Application', application_date: '2024-04-12', pet_name: 'Mittens', pet_species: 'Cat', adopter_name: 'Sarah Johnson', adopter_contact: 'phone: 555-5678' },
  { adoption_id: 14, status: 'Under Verification', application_date: '2024-04-15', pet_name: 'Shadow', pet_species: 'Cat', adopter_name: 'David Brown', adopter_contact: 'phone: 555-8765' },
  { adoption_id: 15, status: 'Approved', application_date: '2024-04-18', pet_name: 'Daisy', pet_species: 'Rabbit', adopter_name: 'Emma Davis', adopter_contact: 'phone: 555-2468' },
  { adoption_id: 16, status: 'Application', application_date: '2024-04-20', pet_name: 'Snowball', pet_species: 'Rabbit', adopter_name: 'Lisa Chen', adopter_contact: 'phone: 555-4321' },
  { adoption_id: 17, status: 'Under Verification', application_date: '2024-04-22', pet_name: 'Rocky', pet_species: 'Dog', adopter_name: 'Robert Taylor', adopter_contact: 'phone: 555-1357' },
  { adoption_id: 18, status: 'Approved', application_date: '2024-04-25', pet_name: 'Buster', pet_species: 'Dog', adopter_name: 'Jennifer White', adopter_contact: 'phone: 555-9753' },
  { adoption_id: 19, status: 'Application', application_date: '2024-04-28', pet_name: 'Fluffy', pet_species: 'Rabbit', adopter_name: 'Kevin Martinez', adopter_contact: 'phone: 555-8642' },
  { adoption_id: 20, status: 'Application', application_date: '2024-04-30', pet_name: 'Polly', pet_species: 'Bird', adopter_name: 'Amanda Garcia', adopter_contact: 'phone: 555-7531' },
  { adoption_id: 21, status: 'Application', application_date: '2024-05-02', pet_name: 'Nemo', pet_species: 'Fish', adopter_name: 'John Smith', adopter_contact: 'phone: 555-1234' },
  { adoption_id: 22, status: 'Application', application_date: '2024-05-05', pet_name: 'Spike', pet_species: 'Hedgehog', adopter_name: 'Lisa Chen', adopter_contact: 'phone: 555-4321' },
  { adoption_id: 23, status: 'Under Verification', application_date: '2024-05-08', pet_name: 'Princess', pet_species: 'Guinea Pig', adopter_name: 'Emma Davis', adopter_contact: 'phone: 555-2468' },
  { adoption_id: 24, status: 'Application', application_date: '2024-05-10', pet_name: 'Bandit', pet_species: 'Ferret', adopter_name: 'Mike Wilson', adopter_contact: 'phone: 555-9876' },
  { adoption_id: 25, status: 'Application', application_date: '2024-05-12', pet_name: 'Rosie', pet_species: 'Pig', adopter_name: 'Robert Taylor', adopter_contact: 'phone: 555-1357' }
];

// Store adopters in memory for this session
let adoptersDatabase = [
  { adopter_id: 1, name: 'John Smith', contact_details: 'phone: 555-1234, email: john@email.com', address: '789 Pine St, City C', preference: 'Dogs, medium to large size' },
  { adopter_id: 2, name: 'Sarah Johnson', contact_details: 'phone: 555-5678, email: sarah@email.com', address: '321 Elm St, City D', preference: 'Cats, indoor pets' },
  { adopter_id: 3, name: 'Mike Wilson', contact_details: 'phone: 555-9876, email: mike@email.com', address: '456 Maple Ave, City E', preference: 'Small dogs, puppies' },
  { adopter_id: 4, name: 'Lisa Chen', contact_details: 'phone: 555-4321, email: lisa@email.com', address: '123 Oak Dr, City F', preference: 'Birds, exotic pets' },
  { adopter_id: 5, name: 'David Brown', contact_details: 'phone: 555-8765, email: david@email.com', address: '789 Elm Ct, City G', preference: 'Cats, senior pets' },
  { adopter_id: 6, name: 'Emma Davis', contact_details: 'phone: 555-2468, email: emma@email.com', address: '321 Pine Rd, City H', preference: 'Rabbits, small animals' },
  { adopter_id: 7, name: 'Robert Taylor', contact_details: 'phone: 555-1357, email: robert@email.com', address: '654 Cedar Ave, City I', preference: 'Large dogs, working breeds' },
  { adopter_id: 8, name: 'Jennifer White', contact_details: 'phone: 555-9753, email: jennifer@email.com', address: '987 Birch St, City J', preference: 'Any species, rescue advocate' },
  { adopter_id: 9, name: 'Kevin Martinez', contact_details: 'phone: 555-8642, email: kevin@email.com', address: '147 Willow Ln, City K', preference: 'Dogs, family pets' },
  { adopter_id: 10, name: 'Amanda Garcia', contact_details: 'phone: 555-7531, email: amanda@email.com', address: '258 Spruce Blvd, City L', preference: 'Cats, quiet companions' }
];

export const apiService = {
  // Pet Management
  async listPets(status?: string, species?: string) {
    let filtered = [...petsDatabase];
    if (status) filtered = filtered.filter(pet => pet.current_status === status);
    if (species) filtered = filtered.filter(pet => pet.species === species);
    return filtered;
  },

  async addPet(petData: any) {
    console.log('Adding pet:', petData);
    const newPetId = Math.max(...petsDatabase.map(p => p.pet_id)) + 1;
    const newPet = {
      pet_id: newPetId,
      name: petData.name,
      species: petData.species,
      breed: petData.breed,
      age: petData.age,
      gender: petData.gender,
      health_status: petData.health_status,
      rescue_date: petData.rescue_date.format('YYYY-MM-DD'),
      current_status: 'Available',
      shelter_name: 'Happy Paws Shelter'
    };
    petsDatabase.push(newPet);
    return { pet_id: newPetId, message: 'Pet added successfully' };
  },

  async updatePet(petId: number, petData: any) {
    console.log('Updating pet:', petId, petData);
    const petIndex = petsDatabase.findIndex(p => p.pet_id === petId);
    if (petIndex !== -1) {
      petsDatabase[petIndex] = {
        ...petsDatabase[petIndex],
        name: petData.name,
        species: petData.species,
        breed: petData.breed,
        age: petData.age,
        gender: petData.gender,
        health_status: petData.health_status,
        rescue_date: petData.rescue_date.format('YYYY-MM-DD')
      };
    }
    return { affected_rows: 1, message: 'Pet updated successfully' };
  },

  async markPetStatus(petId: number, status: string) {
    console.log('Updating pet status:', petId, status);
    const petIndex = petsDatabase.findIndex(p => p.pet_id === petId);
    if (petIndex !== -1) {
      petsDatabase[petIndex].current_status = status;
    }
    return { affected_rows: 1, message: 'Status updated successfully' };
  },

  async getPetDetails(petId: number) {
    const response = await api.get(`/pets/${petId}`);
    return response.data;
  },

  // Adopter Management
  async registerAdopter(adopterData: any) {
    console.log('Registering adopter:', adopterData);
    const newAdopterId = Math.max(...adoptersDatabase.map(a => a.adopter_id)) + 1;
    const newAdopter = {
      adopter_id: newAdopterId,
      name: adopterData.name,
      contact_details: adopterData.contact_details,
      address: adopterData.address,
      preference: adopterData.preference
    };
    adoptersDatabase.push(newAdopter);
    return { adopter_id: newAdopterId, message: 'Adopter registered successfully' };
  },

  async updateAdopter(adopterId: number, adopterData: any) {
    console.log('Updating adopter:', adopterId, adopterData);
    const adopterIndex = adoptersDatabase.findIndex(a => a.adopter_id === adopterId);
    if (adopterIndex !== -1) {
      adoptersDatabase[adopterIndex] = {
        ...adoptersDatabase[adopterIndex],
        name: adopterData.name,
        contact_details: adopterData.contact_details,
        address: adopterData.address,
        preference: adopterData.preference
      };
    }
    return { affected_rows: 1, message: 'Adopter updated successfully' };
  },

  async getAdopterDetails(adopterId: number) {
    const response = await api.get(`/adopters/${adopterId}`);
    return response.data;
  },

  async getAdoptionHistory(adopterId: number) {
    const response = await api.get(`/adopters/${adopterId}/history`);
    return response.data;
  },

  async listAdopters() {
    return [...adoptersDatabase];
  },

  // Adoption Workflow
  async submitAdoptionApplication(applicationData: any) {
    console.log('Submitting adoption application:', applicationData);
    // In real app, this would save to database
    return { 
      application_id: Math.floor(Math.random() * 1000), 
      message: 'Application submitted successfully',
      status: 'Pending'
    };
  },

  async moveToVerification(adoptionId: number, verifiedBy: string, notes: string) {
    console.log('Moving to verification:', adoptionId, verifiedBy, notes);
    const appIndex = applicationsDatabase.findIndex(app => app.adoption_id === adoptionId);
    if (appIndex !== -1) {
      applicationsDatabase[appIndex].status = 'Under Verification';
    }
    return { affected_rows: 1, message: 'Moved to verification stage' };
  },

  async approveAdoption(adoptionId: number, approvedBy: string, notes: string) {
    console.log('Approving adoption:', adoptionId, approvedBy, notes);
    const appIndex = applicationsDatabase.findIndex(app => app.adoption_id === adoptionId);
    if (appIndex !== -1) {
      applicationsDatabase[appIndex].status = 'Approved';
    }
    return { affected_rows: 1, message: 'Adoption approved' };
  },

  async rejectAdoption(adoptionId: number, rejectedBy: string, reason: string) {
    console.log('Rejecting adoption:', adoptionId, rejectedBy, reason);
    const appIndex = applicationsDatabase.findIndex(app => app.adoption_id === adoptionId);
    if (appIndex !== -1) {
      applicationsDatabase[appIndex].status = 'Rejected';
    }
    return { affected_rows: 1, message: 'Adoption rejected' };
  },

  async completeAdoption(adoptionId: number, notes: string) {
    console.log('Completing adoption:', adoptionId, notes);
    const appIndex = applicationsDatabase.findIndex(app => app.adoption_id === adoptionId);
    if (appIndex !== -1) {
      applicationsDatabase[appIndex].status = 'Completed';
    }
    return { affected_rows: 1, message: 'Final adoption completed' };
  },

  async getAdoptionWorkflowStatus(adoptionId: number) {
    const response = await api.get(`/adoptions/${adoptionId}`);
    return response.data;
  },

  async listApplicationsByStatus(status?: string) {
    if (status && status !== 'All') {
      return applicationsDatabase.filter(app => app.status === status);
    }
    return [...applicationsDatabase];
  },

  // Pet Matching
  async suggestPetsForAdopter(adopterId: number, preferences: any) {
    const response = await api.post('/matching/suggest', { adopterId, ...preferences });
    return response.data;
  },

  async quickMatchForAdopter(adopterId: number) {
    const response = await api.get(`/matching/quick/${adopterId}`);
    return response.data;
  },

  async findPerfectMatches(criteria: any) {
    const response = await api.post('/matching/perfect', criteria);
    return response.data;
  },

  // Veterinary Records
  async addVaccinationRecord(vaccinationData: any) {
    console.log('Adding vaccination record:', vaccinationData);
    return { vaccination_id: Math.floor(Math.random() * 1000), message: 'Vaccination record added' };
  },

  async addTreatmentRecord(treatmentData: any) {
    console.log('Adding treatment record:', treatmentData);
    return { care_id: Math.floor(Math.random() * 1000), message: 'Treatment record added' };
  },

  async getVeterinaryHistory(petId: number) {
    const response = await api.get(`/veterinary/history/${petId}`);
    return response.data;
  },

  async getVaccinationRecords() {
    // Mock vaccination records
    return [
      { vaccination_id: 1, pet_id: 1, pet_name: 'Buddy', vaccine_name: 'Rabies', vaccination_date: '2024-02-01', next_due_date: '2025-02-01', vet_name: 'Dr. Emily Wilson', batch_number: 'RB2024-001', notes: 'Annual rabies vaccination' },
      { vaccination_id: 2, pet_id: 2, pet_name: 'Whiskers', vaccine_name: 'FVRCP', vaccination_date: '2024-02-15', next_due_date: '2025-02-15', vet_name: 'Dr. Michael Brown', batch_number: 'FV2024-002', notes: 'Feline core vaccines' },
      { vaccination_id: 3, pet_id: 3, pet_name: 'Max', vaccine_name: 'DHPP', vaccination_date: '2024-02-28', next_due_date: '2025-02-28', vet_name: 'Dr. Emily Wilson', batch_number: 'DH2024-003', notes: 'Canine core vaccines' },
      { vaccination_id: 4, pet_id: 4, pet_name: 'Luna', vaccine_name: 'FVRCP', vaccination_date: '2024-03-02', next_due_date: '2025-03-02', vet_name: 'Dr. Sarah Martinez', batch_number: 'FV2024-004', notes: 'Kitten vaccination series' },
      { vaccination_id: 5, pet_id: 5, pet_name: 'Charlie', vaccine_name: 'Bordetella', vaccination_date: '2024-02-25', next_due_date: '2024-08-25', vet_name: 'Dr. James Lee', batch_number: 'BD2024-005', notes: 'Kennel cough prevention' },
      { vaccination_id: 6, pet_id: 8, pet_name: 'Bella', vaccine_name: 'DHPP', vaccination_date: '2024-03-12', next_due_date: '2025-03-12', vet_name: 'Dr. Sarah Martinez', batch_number: 'DH2024-006', notes: 'Puppy vaccination complete' },
      { vaccination_id: 7, pet_id: 11, pet_name: 'Tweety', vaccine_name: 'Polyomavirus', vaccination_date: '2024-02-18', next_due_date: '2025-02-18', vet_name: 'Dr. Michael Brown', batch_number: 'PV2024-007', notes: 'Bird-specific vaccine' },
      { vaccination_id: 8, pet_id: 15, pet_name: 'Rocky', vaccine_name: 'Rabies', vaccination_date: '2024-02-24', next_due_date: '2025-02-24', vet_name: 'Dr. Michael Brown', batch_number: 'RB2024-008', notes: 'Large breed vaccination' },
      { vaccination_id: 9, pet_id: 17, pet_name: 'Buster', vaccine_name: 'Lyme Disease', vaccination_date: '2024-03-17', next_due_date: '2025-03-17', vet_name: 'Dr. James Lee', batch_number: 'LY2024-009', notes: 'Tick-borne disease prevention' },
      { vaccination_id: 10, pet_id: 25, pet_name: 'Bandit', vaccine_name: 'Distemper', vaccination_date: '2024-04-01', next_due_date: '2025-04-01', vet_name: 'Dr. James Lee', batch_number: 'DS2024-010', notes: 'Ferret distemper vaccine' }
    ];
  },

  async getTreatmentHistory() {
    // Mock treatment history
    return [
      { care_id: 1, pet_id: 1, pet_name: 'Buddy', checkup_date: '2024-02-01', treatment: 'Routine checkup, vaccinations', vet_name: 'Dr. Emily Wilson', follow_up_date: '2024-08-01', notes: 'Healthy, no issues found' },
      { care_id: 2, pet_id: 2, pet_name: 'Whiskers', checkup_date: '2024-02-15', treatment: 'Vaccination, deworming', vet_name: 'Dr. Michael Brown', follow_up_date: '2024-08-15', notes: 'Mild parasites treated' },
      { care_id: 3, pet_id: 4, pet_name: 'Luna', checkup_date: '2024-03-02', treatment: 'Spay surgery, post-op care', vet_name: 'Dr. Sarah Martinez', follow_up_date: '2024-03-16', notes: 'Surgery successful, healing well' },
      { care_id: 4, pet_id: 6, pet_name: 'Mittens', checkup_date: '2024-01-28', treatment: 'Spay surgery, dental cleaning', vet_name: 'Dr. Emily Wilson', follow_up_date: '2024-02-11', notes: 'Dental tartar removed, surgery complete' },
      { care_id: 5, pet_id: 7, pet_name: 'Rex', checkup_date: '2024-02-08', treatment: 'Arthritis medication, joint supplements', vet_name: 'Dr. Michael Brown', follow_up_date: '2024-05-08', notes: 'Mobility improved with medication' },
      { care_id: 6, pet_id: 8, pet_name: 'Bella', checkup_date: '2024-03-12', treatment: 'Routine checkup, heartworm test', vet_name: 'Dr. Sarah Martinez', follow_up_date: '2024-09-12', notes: 'Heartworm negative, healthy puppy' },
      { care_id: 7, pet_id: 9, pet_name: 'Shadow', checkup_date: '2024-02-02', treatment: 'Senior wellness exam, blood work', vet_name: 'Dr. James Lee', follow_up_date: '2024-05-02', notes: 'Senior cat, kidney function normal' },
      { care_id: 8, pet_id: 11, pet_name: 'Tweety', checkup_date: '2024-02-18', treatment: 'Wing clipping, health check', vet_name: 'Dr. Michael Brown', follow_up_date: '2024-05-18', notes: 'Wing clipping for safety' },
      { care_id: 9, pet_id: 13, pet_name: 'Snowball', checkup_date: '2024-03-01', treatment: 'Grooming, parasite check', vet_name: 'Dr. James Lee', follow_up_date: '2024-06-01', notes: 'Matted fur removed, no parasites' },
      { care_id: 10, pet_id: 15, pet_name: 'Rocky', checkup_date: '2024-02-24', treatment: 'Routine checkup, deworming', vet_name: 'Dr. Michael Brown', follow_up_date: '2024-08-24', notes: 'Large breed health assessment' },
      { care_id: 11, pet_id: 17, pet_name: 'Buster', checkup_date: '2024-03-17', treatment: 'Neuter surgery, recovery', vet_name: 'Dr. James Lee', follow_up_date: '2024-03-31', notes: 'Neuter surgery successful' },
      { care_id: 12, pet_id: 19, pet_name: 'Polly', checkup_date: '2024-03-20', treatment: 'Wing examination, nutrition advice', vet_name: 'Dr. Michael Brown', follow_up_date: '2024-06-20', notes: 'Young bird development normal' },
      { care_id: 13, pet_id: 21, pet_name: 'Zeus', checkup_date: '2024-01-30', treatment: 'Routine checkup, X-rays', vet_name: 'Dr. James Lee', follow_up_date: '2024-07-30', notes: 'Joint health good for large breed' },
      { care_id: 14, pet_id: 23, pet_name: 'Spike', checkup_date: '2024-03-27', treatment: 'Quill examination, diet plan', vet_name: 'Dr. Michael Brown', follow_up_date: '2024-09-27', notes: 'Hedgehog health excellent' },
      { care_id: 15, pet_id: 25, pet_name: 'Bandit', checkup_date: '2024-04-01', treatment: 'Health screening, play assessment', vet_name: 'Dr. James Lee', follow_up_date: '2024-10-01', notes: 'Active ferret, very healthy' }
    ];
  },

  async getPendingReminders(daysAhead?: number) {
    // Expanded mock data with more reminders
    return [
      { reminder_id: 1, pet_id: 1, pet_name: 'Buddy', reminder_type: 'Vaccination', due_date: '2024-04-15', description: 'Annual rabies vaccination due', status: 'Pending' },
      { reminder_id: 2, pet_id: 2, pet_name: 'Whiskers', reminder_type: 'General Checkup', due_date: '2024-03-25', description: 'Routine health checkup', status: 'Overdue' },
      { reminder_id: 3, pet_id: 4, pet_name: 'Luna', reminder_type: 'Spay Surgery', due_date: '2024-05-20', description: 'Spay surgery scheduled', status: 'Pending' },
      { reminder_id: 4, pet_id: 6, pet_name: 'Mittens', reminder_type: 'Dental Cleaning', due_date: '2024-05-15', description: 'Annual dental cleaning', status: 'Pending' },
      { reminder_id: 5, pet_id: 7, pet_name: 'Rex', reminder_type: 'Arthritis Checkup', due_date: '2024-04-30', description: 'Arthritis medication review', status: 'Overdue' },
      { reminder_id: 6, pet_id: 8, pet_name: 'Bella', reminder_type: 'Vaccination', due_date: '2024-05-25', description: 'DHPP booster shot', status: 'Pending' },
      { reminder_id: 7, pet_id: 9, pet_name: 'Shadow', reminder_type: 'Senior Wellness', due_date: '2024-05-10', description: 'Senior cat wellness exam', status: 'Pending' },
      { reminder_id: 8, pet_id: 11, pet_name: 'Tweety', reminder_type: 'Wing Clipping', due_date: '2024-05-05', description: 'Wing clipping maintenance', status: 'Pending' },
      { reminder_id: 9, pet_id: 13, pet_name: 'Snowball', reminder_type: 'Grooming', due_date: '2024-04-28', description: 'Angora rabbit grooming', status: 'Overdue' },
      { reminder_id: 10, pet_id: 15, pet_name: 'Rocky', reminder_type: 'Heartworm Test', due_date: '2024-05-30', description: 'Annual heartworm screening', status: 'Pending' },
      { reminder_id: 11, pet_id: 17, pet_name: 'Buster', reminder_type: 'Neuter Surgery', due_date: '2024-06-01', description: 'Neuter surgery scheduled', status: 'Pending' },
      { reminder_id: 12, pet_id: 19, pet_name: 'Polly', reminder_type: 'Health Checkup', due_date: '2024-05-18', description: 'Young bird health assessment', status: 'Pending' },
      { reminder_id: 13, pet_id: 21, pet_name: 'Zeus', reminder_type: 'Joint Supplement', due_date: '2024-05-12', description: 'Large breed joint health check', status: 'Pending' },
      { reminder_id: 14, pet_id: 23, pet_name: 'Spike', reminder_type: 'Exotic Checkup', due_date: '2024-05-22', description: 'Hedgehog wellness exam', status: 'Pending' },
      { reminder_id: 15, pet_id: 25, pet_name: 'Bandit', reminder_type: 'Vaccination', due_date: '2024-06-05', description: 'Ferret distemper vaccine', status: 'Pending' }
    ];
  },

  async completeReminder(reminderId: number) {
    const response = await api.patch(`/veterinary/reminders/${reminderId}/complete`);
    return response.data;
  },

  // Shelter Management
  async getShelterStats(shelterId?: number) {
    const response = await api.get('/shelters/stats', { params: { shelterId } });
    return response.data;
  },

  async getAllSheltersOverview() {
    // Mock data matching database
    return [
      { shelter_id: 1, name: 'Happy Paws Shelter', location: '123 Main St, City A', capacity: 50, current_occupancy: 35, available_space: 15, occupancy_percentage: 70, status: 'Active', total_rescued: 120 },
      { shelter_id: 2, name: 'Animal Haven', location: '456 Oak Ave, City B', capacity: 75, current_occupancy: 68, available_space: 7, occupancy_percentage: 90.7, status: 'Active', total_rescued: 200 },
      { shelter_id: 3, name: 'Rescue Paradise', location: '789 Cedar Blvd, City C', capacity: 60, current_occupancy: 42, available_space: 18, occupancy_percentage: 70, status: 'Active', total_rescued: 150 },
      { shelter_id: 4, name: 'Furry Friends Sanctuary', location: '321 Birch Lane, City D', capacity: 40, current_occupancy: 28, available_space: 12, occupancy_percentage: 70, status: 'Active', total_rescued: 95 },
      { shelter_id: 5, name: 'Paws & Hearts Shelter', location: '654 Willow Dr, City E', capacity: 80, current_occupancy: 55, available_space: 25, occupancy_percentage: 68.8, status: 'Active', total_rescued: 180 },
      { shelter_id: 6, name: 'Safe Haven Animal Rescue', location: '987 Spruce St, City F', capacity: 35, current_occupancy: 22, available_space: 13, occupancy_percentage: 62.9, status: 'Active', total_rescued: 85 },
      { shelter_id: 7, name: 'Loving Hearts Sanctuary', location: '159 Maple Ave, City G', capacity: 45, current_occupancy: 30, available_space: 15, occupancy_percentage: 66.7, status: 'Active', total_rescued: 110 },
      { shelter_id: 8, name: 'Second Chance Shelter', location: '753 Pine Ridge, City H', capacity: 55, current_occupancy: 38, available_space: 17, occupancy_percentage: 69.1, status: 'Active', total_rescued: 140 },
      { shelter_id: 9, name: 'Guardian Angels Pet Rescue', location: '246 Elm Street, City I', capacity: 65, current_occupancy: 45, available_space: 20, occupancy_percentage: 69.2, status: 'Active', total_rescued: 165 },
      { shelter_id: 10, name: 'Forever Home Foundation', location: '864 Oak Hill Dr, City J', capacity: 70, current_occupancy: 50, available_space: 20, occupancy_percentage: 71.4, status: 'Active', total_rescued: 190 }
    ];
  },

  async getCapacityReport() {
    // Calculate from actual shelter data
    const shelters = await this.getAllSheltersOverview();
    const totalCapacity = shelters.reduce((sum, s) => sum + s.capacity, 0);
    const totalOccupied = shelters.reduce((sum, s) => sum + s.current_occupancy, 0);
    const totalAvailable = shelters.reduce((sum, s) => sum + s.available_space, 0);
    const avgOccupancy = (totalOccupied / totalCapacity) * 100;
    
    return {
      total_shelters: shelters.length,
      total_capacity: totalCapacity,
      total_occupied: totalOccupied,
      total_available: totalAvailable,
      avg_occupancy_percentage: Math.round(avgOccupancy * 10) / 10,
      full_shelters: shelters.filter(s => s.occupancy_percentage >= 100).length,
      active_shelters: shelters.filter(s => s.status === 'Active').length
    };
  },

  async findAvailableShelters(minSpace?: number) {
    const response = await api.get('/shelters/available', { params: { minSpace } });
    return response.data;
  },

  async transferPet(petId: number, fromShelterId: number, toShelterId: number) {
    console.log('Transferring pet:', petId, 'from', fromShelterId, 'to', toShelterId);
    return { message: 'Transfer successful', remaining_space: 5 };
  },

  // Reports and Analytics
  async getAdoptionStats() {
    const pets = await this.listPets();
    const adopters = await this.listAdopters();
    const applications = await this.listApplicationsByStatus();
    
    const totalPets = pets.length;
    const adoptedPets = pets.filter(p => p.current_status === 'Adopted').length;
    const availablePets = pets.filter(p => p.current_status === 'Available').length;
    const underCare = pets.filter(p => p.current_status === 'Under Care').length;
    const reserved = pets.filter(p => p.current_status === 'Reserved').length;
    
    return {
      total_pets: totalPets,
      total_adopted: adoptedPets,
      still_waiting: availablePets,
      reserved: reserved,
      under_care: underCare,
      total_adopters: adopters.length,
      pending_applications: applications.filter(a => a.status === 'Application').length,
      adoption_rate_percentage: 90.0 // Fixed at 90%
    };
  },

  async getPopularSpecies() {
    // Mock data matching expanded database
    return [
      { species: 'Dog', total_count: 9, adopted_count: 3, available_count: 5, adoption_rate: 33.3 },
      { species: 'Cat', total_count: 7, adopted_count: 3, available_count: 4, adoption_rate: 42.9 },
      { species: 'Bird', total_count: 3, adopted_count: 1, available_count: 2, adoption_rate: 33.3 },
      { species: 'Rabbit', total_count: 3, adopted_count: 0, available_count: 3, adoption_rate: 0.0 },
      { species: 'Fish', total_count: 1, adopted_count: 0, available_count: 1, adoption_rate: 0.0 },
      { species: 'Hedgehog', total_count: 1, adopted_count: 0, available_count: 1, adoption_rate: 0.0 },
      { species: 'Guinea Pig', total_count: 1, adopted_count: 0, available_count: 1, adoption_rate: 0.0 },
      { species: 'Ferret', total_count: 1, adopted_count: 0, available_count: 1, adoption_rate: 0.0 },
      { species: 'Pig', total_count: 1, adopted_count: 0, available_count: 1, adoption_rate: 0.0 }
    ];
  },

  async getPopularBreeds(species?: string) {
    // Mock data for development
    return [
      { breed: 'Golden Retriever', species: 'Dog', total_count: 8, adopted_count: 5, available_count: 3, adoption_rate: 62.5 },
      { breed: 'Persian', species: 'Cat', total_count: 6, adopted_count: 4, available_count: 2, adoption_rate: 66.7 },
      { breed: 'Labrador', species: 'Dog', total_count: 7, adopted_count: 3, available_count: 4, adoption_rate: 42.9 },
      { breed: 'Siamese', species: 'Cat', total_count: 5, adopted_count: 3, available_count: 2, adoption_rate: 60.0 }
    ];
  },

  async getMonthlyTrends(year?: number) {
    // Mock data for development
    return [
      { year: 2024, month: 1, month_name: 'January', completed_adoptions: 8, total_applications: 12 },
      { year: 2024, month: 2, month_name: 'February', completed_adoptions: 6, total_applications: 10 },
      { year: 2024, month: 3, month_name: 'March', completed_adoptions: 10, total_applications: 15 },
      { year: 2024, month: 4, month_name: 'April', completed_adoptions: 7, total_applications: 11 },
      { year: 2024, month: 5, month_name: 'May', completed_adoptions: 9, total_applications: 14 },
      { year: 2024, month: 6, month_name: 'June', completed_adoptions: 5, total_applications: 8 }
    ];
  },

  async getAgeGroupAnalysis() {
    // Mock data for development
    return [
      { age_group: 'Baby (0-1 years)', total_count: 15, adopted_count: 12, available_count: 3, avg_days_in_shelter: 25 },
      { age_group: 'Young (2-3 years)', total_count: 28, adopted_count: 18, available_count: 10, avg_days_in_shelter: 45 },
      { age_group: 'Adult (4-7 years)', total_count: 25, adopted_count: 12, available_count: 13, avg_days_in_shelter: 75 },
      { age_group: 'Senior (8+ years)', total_count: 13, adopted_count: 3, available_count: 10, avg_days_in_shelter: 120 }
    ];
  },

  async getShelterPerformanceReport() {
    const response = await api.get('/reports/shelter-performance');
    return response.data;
  },

  async getWaitingTimeAnalysis() {
    // Mock data for development
    return [
      { waiting_period: '0-30 days', pet_count: 8, pets: 'Luna (Cat), Max (Dog)' },
      { waiting_period: '31-90 days', pet_count: 12, pets: 'Buddy (Dog), Whiskers (Cat)' },
      { waiting_period: '91-180 days', pet_count: 6, pets: 'Charlie (Dog), Mittens (Cat)' },
      { waiting_period: '181-365 days', pet_count: 3, pets: 'Rex (Dog)' },
      { waiting_period: 'Over 1 year', pet_count: 2, pets: 'Shadow (Cat)' }
    ];
  },

  async getTopAdopters() {
    const response = await api.get('/reports/top-adopters');
    return response.data;
  },

  // Donations
  async listDonations() {
    return [
      { donation_id: 1, donor_name: 'John Smith', amount: 500.00, date: '2024-01-15', purpose: 'Food' },
      { donation_id: 2, donor_name: 'Sarah Johnson', amount: 1200.00, date: '2024-01-20', purpose: 'Medical' },
      { donation_id: 3, donor_name: 'Mike Wilson', amount: 750.00, date: '2024-02-05', purpose: 'Shelter' },
      { donation_id: 4, donor_name: 'Lisa Chen', amount: 300.00, date: '2024-02-12', purpose: 'Food' },
      { donation_id: 5, donor_name: 'David Brown', amount: 2000.00, date: '2024-02-18', purpose: 'Medical' },
      { donation_id: 6, donor_name: 'Emma Davis', amount: 450.00, date: '2024-03-01', purpose: 'Food' },
      { donation_id: 7, donor_name: 'Robert Taylor', amount: 1500.00, date: '2024-03-08', purpose: 'Shelter' },
      { donation_id: 8, donor_name: 'Jennifer White', amount: 800.00, date: '2024-03-15', purpose: 'Medical' },
      { donation_id: 9, donor_name: 'Kevin Martinez', amount: 600.00, date: '2024-03-22', purpose: 'Food' },
      { donation_id: 10, donor_name: 'Amanda Garcia', amount: 1000.00, date: '2024-04-01', purpose: 'Medical' },
      { donation_id: 11, donor_name: 'Pet Lovers Foundation', amount: 5000.00, date: '2024-04-05', purpose: 'Shelter' },
      { donation_id: 12, donor_name: 'Animal Care Society', amount: 2500.00, date: '2024-04-10', purpose: 'Medical' },
      { donation_id: 13, donor_name: 'Local Business Group', amount: 1800.00, date: '2024-04-15', purpose: 'Food' },
      { donation_id: 14, donor_name: 'Community Volunteers', amount: 900.00, date: '2024-04-20', purpose: 'Shelter' },
      { donation_id: 15, donor_name: 'Anonymous Donor', amount: 3000.00, date: '2024-04-25', purpose: 'Medical' }
    ];
  },

  async addDonation(donationData: any) {
    console.log('Adding donation:', donationData);
    return { donation_id: Math.floor(Math.random() * 1000), message: 'Donation recorded successfully' };
  },

  async getDonationStats() {
    const donations = await this.listDonations();
    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
    const foodDonations = donations.filter(d => d.purpose === 'Food').reduce((sum, d) => sum + d.amount, 0);
    const medicalDonations = donations.filter(d => d.purpose === 'Medical').reduce((sum, d) => sum + d.amount, 0);
    const shelterDonations = donations.filter(d => d.purpose === 'Shelter').reduce((sum, d) => sum + d.amount, 0);
    
    return {
      total_amount: totalAmount,
      total_donations: donations.length,
      food_donations: foodDonations,
      medical_donations: medicalDonations,
      shelter_donations: shelterDonations
    };
  },

  // Certificates
  async generateCertificate(adoptionId: number) {
    const response = await api.post(`/certificates/generate/${adoptionId}`);
    return response.data;
  },

  async getCertificateDetails(certificateNumber: string) {
    const response = await api.get(`/certificates/${certificateNumber}`);
    return response.data;
  },

  async getCertificateText(certificateNumber: string) {
    const response = await api.get(`/certificates/${certificateNumber}/text`);
    return response.data;
  },

  async verifyCertificate(certificateNumber: string) {
    const response = await api.get(`/certificates/${certificateNumber}/verify`);
    return response.data;
  },

  // Password Reset
  async requestPasswordReset(email: string) {
    console.log('Requesting password reset for:', email);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const validEmails = ['admin@petadoption.com', 'user@petadoption.com'];
    
    if (validEmails.includes(email)) {
      const token = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return {
        success: true,
        message: 'Password reset code sent to your email.',
        token
      };
    } else {
      return {
        success: false,
        message: 'Email address not found.'
      };
    }
  },

  async verifyResetToken(token: string) {
    console.log('Verifying reset token:', token);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (token.startsWith('reset_')) {
      return {
        success: true,
        message: 'Token verified successfully.'
      };
    } else {
      return {
        success: false,
        message: 'Invalid or expired reset token.'
      };
    }
  },

  async resetPassword(token: string, newPassword: string) {
    console.log('Resetting password with token:', token);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (token.startsWith('reset_') && newPassword.length >= 6) {
      return {
        success: true,
        message: 'Password reset successfully. You can now login with your new password.'
      };
    } else {
      return {
        success: false,
        message: 'Failed to reset password. Please check your token and password requirements.'
      };
    }
  },
};

export default apiService;