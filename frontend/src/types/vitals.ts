export interface PhysiologicalSystem {
  name: string;
  urban_source: string;
  value: number;
  status: string;
  description: string;
}

export interface CityVitals {
  hour: number;
  arteries: PhysiologicalSystem;
  lungs: PhysiologicalSystem;
  neural: PhysiologicalSystem;
  immune: PhysiologicalSystem;
  overall_stress: number;
  organism_status: string;
}
