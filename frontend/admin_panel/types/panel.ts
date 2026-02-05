export interface PanelData {
    id: string;
    tobacconistCode?: string;
    tobacconistId?: string;
    name: string;
    brandId: string;
    description?: string;
    origin?: string;
    strength?: number; // 0=Mild, 1=Medium, 2=Full
    wrapper?: string;
    wrapperColor?: number; // 0=Claro, 1=Colorado, 2=Maduro, 3=Oscuro
    binder?: string;
    filler?: string;
    masterLine?: string;
    rollingType?: string;
    shape?: string;
    price?: number;
    rating?: number;
    numberInBox?: number;
    ring?: number;
    smokingTime?: number;
    type?: number; // 0=Premium, 1=Toscano, 2=MachineMade
    brand?: {
        id: string;
        name: string;
        country?: string;
        logoUrl?: string;
    };
}
