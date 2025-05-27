import {
    CropType
} from './constants';

type InventoryData = {
    seeds: Record<CropType, number>;
    crops: Record<CropType, number>;
};

export class Inventory {
    private inventory: InventoryData;

    constructor() {
        this.inventory = {
            seeds: {
                wheat: 10, // starting inventory, can be zero
                tomato: 90,
                grape: 0
            },
            crops: {
                wheat: 0,
                tomato: 0,
                grape: 0
            }
        };
    }

    addSeed(type: CropType, amount: number = 1): void {
        this.inventory.seeds[type] += amount;
        this.saveState();
    }

    removeSeed(type: CropType, amount: number = 1): boolean {
        if (this.inventory.seeds[type] >= amount) {
            this.inventory.seeds[type] -= amount;
            this.saveState();
            return true;
        }
        return false;
    }

    addCrop(type: CropType, amount: number = 1): void {
        this.inventory.crops[type] += amount;
        this.saveState();
    }

    removeCrop(type: CropType, amount: number = 1): boolean {
        if (this.inventory.crops[type] >= amount) {
            this.inventory.crops[type] -= amount;
            this.saveState();
            return true;
        }
        return false;
    }

    getInventory(): InventoryData {
        return this.inventory;
    }

    saveState(): void {
        localStorage.setItem("inventory", JSON.stringify(this.inventory));
    }

    loadStateFromStorage(): boolean {
        const state = localStorage.getItem("inventory");
        if (!state) return false;
        return this.loadState(state);
    }

    loadState(state: string): boolean {
        try {
            const parsed = JSON.parse(state);
            if (parsed.seeds && parsed.crops) {
                this.inventory = parsed;
                return true;
            }
            return false;
        } catch (e) {
            console.error('Failed to load state:', e);
            return false;
        }
    }
}
