import {
    CropType
} from './constants';
import { SupabaseClient } from '@supabase/supabase-js';

type InventoryData = {
    seeds: Record<CropType, number>;
    crops: Record<CropType, number>;
};

type InventoryCallback = () => void;

export class Inventory {
    private inventory: InventoryData;
    private onChangeCallbacks: InventoryCallback[] = [];

    constructor() {
        // Initialize with zero counts, these will be replaced by database data
        this.inventory = {
            seeds: {
                wheat: 0,
                tomato: 0,
                grapes: 0
            },
            crops: {
                wheat: 0,
                tomato: 0,
                grapes: 0
            }
        };
    }

    async loadFromDatabase(supabase: SupabaseClient, userId: string): Promise<void> {
        const { data, error } = await supabase
            .from('inventory')
            .select('wheat, tomato, grapes')
            .eq('user_id', userId)
            .single();

        if (error) {
            console.error('Error fetching inventory:', error);
            // Optionally handle specific errors like no row found
            // For now, we'll just use the initial zero inventory
        } else if (data) {
            this.inventory.seeds.wheat = data.wheat || 0;
            this.inventory.seeds.tomato = data.tomato || 0;
            this.inventory.seeds.grapes = data.grapes || 0;
            // Note: Crops are not stored in the database table based on the image.
            // If they should be persisted, the table schema and loading logic need adjustment.
        }
        this.notifyChange(); // Notify UI after loading from DB
    }

    addOnChangeCallback(callback: InventoryCallback): void {
        this.onChangeCallbacks.push(callback);
    }

    private notifyChange(): void {
        this.onChangeCallbacks.forEach(callback => callback());
    }

    async addSeed(type: CropType, amount: number = 1, supabase?: SupabaseClient, userId?: string): Promise<void> {
        this.inventory.seeds[type] += amount;
        this.saveState(); // Save to local storage

        if (supabase && userId) {
             const { error } = await supabase
                .from('inventory')
                .update({ [type]: this.inventory.seeds[type] }) // Update the specific seed type column
                .eq('user_id', userId);

            if (error) {
                console.error(`Error updating ${type} seed count in database:`, error);
                // Optionally handle error (e.g., revert local change or show error message)
            }
        }

        this.notifyChange(); // Notify UI
    }

    async removeSeed(type: CropType, amount: number = 1, supabase?: SupabaseClient, userId?: string): Promise<boolean> {
        if (this.inventory.seeds[type] >= amount) {
            this.inventory.seeds[type] -= amount;
            this.saveState(); // Save to local storage

            if (supabase && userId) {
                const { error } = await supabase
                    .from('inventory')
                    .update({ [type]: this.inventory.seeds[type] }) // Update the specific seed type column
                    .eq('user_id', userId);

                if (error) {
                    console.error(`Error updating ${type} seed count in database:`, error);
                    // Optionally handle error (e.g., revert local change or show error message)})
                }
            }

            this.notifyChange(); // Notify UI
            return true;
        }
        return false;
    }

    addCrop(type: CropType, amount: number = 1): void {
        this.inventory.crops[type] += amount;
        this.saveState();
        this.notifyChange();
    }

    removeCrop(type: CropType, amount: number = 1): boolean {
        if (this.inventory.crops[type] >= amount) {
            this.inventory.crops[type] -= amount;
            this.saveState();
            this.notifyChange();
            return true;
        }
        return false;
    }

    getInventory(): InventoryData {
        return this.inventory;
    }

    // Keep local storage for potential offline support or quick saves,
    // but the primary load will be from the database now.
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
            console.error('Failed to load state from storage:', e);
            return false;
        }
    }
}
