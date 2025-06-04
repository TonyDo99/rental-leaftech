export enum EServiceType {
  CLEANING = 'CLEANING',
  MAINTENANCE = 'MAINTENANCE',
  INSPECTION = 'INSPECTION',
  REPAIR = 'REPAIR',
}

export enum EServiceFrequency {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  BIANNUALLY = 'BIANNUALLY',
  ANNUALLY = 'ANNUALLY',
}

export interface ServiceSchedule {
  id: number;
  type: EServiceType;
  frequency: EServiceFrequency;
  roomId: number;
  roomName: string;
  description?: string;
  isActive: boolean;
  lastPerformed: Date | null;
  nextDue: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceConfig {
  id: number;
  type: EServiceType;
  frequency: EServiceFrequency;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceConfigInput {
  type: EServiceType;
  frequency: EServiceFrequency;
  description: string;
  isActive?: boolean;
}

export interface CreateServiceScheduleInput {
  type: EServiceType;
  frequency: EServiceFrequency;
  roomId: number;
  description?: string;
  isActive?: boolean;
}
