'use client';

import {useEffect, useState} from 'react';
import '../garden/style.css';
import '../globals.css';
import {Inventory} from "@/app/garden/Inventory";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {AppHeader} from "@/components/app-header";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

type CropType = 'wheat' | 'tomato' | 'grapes';

type Bundle = {
    name: string;
    requirements: Record<CropType, number>;
};

const SPECIAL_BUNDLES: Bundle[] = [
    {
        name: 'Super Harvest Bundle',
        requirements: {wheat: 3, tomato: 2, grapes: 1},
    },
    {
        name: 'Tomato Lover Bundle',
        requirements: {wheat: 0, tomato: 999, grapes: 0},
    },
    {
        name: 'Winemaker’s Delight',
        requirements: {wheat: 1, tomato: 0, grapes: 4},
    },
];


export default function SpecialOrdersPage() {
    const [inventory, setInventory] = useState<Inventory | null>(null);
    const [bundleStatuses, setBundleStatuses] = useState<Record<number, 'success' | 'fail' | null>>({});

    useEffect(() => {
        const loadInventory = async () => {
            const inv = new Inventory();
            const supabase = createClientComponentClient();
            const {data: {session}} = await supabase.auth.getSession();

            if (session?.user) {
                await inv.loadFromDatabase(supabase, session.user.id);
            } else {
                console.warn("No user session found, using default zero inventory.");
            }

            console.log(inv.toString());
            setInventory(inv); // Trigger re-render with loaded inventory
        };

        loadInventory();
    }, []);

    const attemptBundleSubmit = (bundleIndex: number) => {
        if (!inventory) return;

        const bundle = SPECIAL_BUNDLES[bundleIndex];
        const userCrops = inventory.getInventory().crops;

        const hasAll = (['wheat', 'tomato', 'grapes'] as CropType[]).every(
            crop => userCrops[crop] >= bundle.requirements[crop]
        );

        setBundleStatuses(prev => ({
            ...prev,
            [bundleIndex]: hasAll ? 'success' : 'fail'
        }));

        if (hasAll) {
            Object.entries(bundle.requirements).forEach(([crop, amt]) => {
                inventory.removeCrop(crop as CropType, amt);
            });
        }
    };


    if (!inventory) {
        return (
            <>
                <AppHeader/>
                <div>Loading inventory...</div>
            </>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-[#f5f2e9]">
                <AppHeader/>
                <main className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-medium text-[#5d6b5d] mb-2">Special Orders</h1>
                        <p className="text-[#6c6c6c]">Grow crops to complete these bundles!</p>
                    </div>
                    <div className="special-orders grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SPECIAL_BUNDLES.map((bundle, index) => {
                            const hasAll = (['wheat', 'tomato', 'grapes'] as CropType[]).every(
                                crop => inventory.getInventory().crops[crop] >= bundle.requirements[crop]
                            );

                            return (
                                <Card key={index} className="order-row bundle-card">
                                    <CardHeader>
                                        <CardTitle>{bundle.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {(['wheat', 'tomato', 'grapes'] as CropType[]).map(crop => (
                                            <div key={crop} className="mb-2">
                                                <h3 className="font-semibold">
                                                    {crop.charAt(0).toUpperCase() + crop.slice(1)}
                                                </h3>
                                                <p>Available: {inventory.getInventory().crops[crop]}</p>
                                                <p>Required: {bundle.requirements[crop]}</p>
                                            </div>
                                        ))}
                                    </CardContent>
                                    <div className="p-4 pt-0">
                                        <p className="min-h-[1.5rem] mb-2">
                                            {bundleStatuses[index] === 'success' && '✅ Bundle submitted!'}
                                            {bundleStatuses[index] === 'fail' && '❌ Not enough crops.'}
                                            {bundleStatuses[index] === null && '\u00A0'}
                                        </p>
                                        <Button onClick={() => attemptBundleSubmit(index)}>
                                            Submit {bundle.name}
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </main>
            </div>
        </>
    );
}
