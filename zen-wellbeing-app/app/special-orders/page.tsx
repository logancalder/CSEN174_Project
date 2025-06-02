'use client';

import {useEffect, useState} from 'react';
import '../garden/style.css';
import '../globals.css';
import {Inventory} from "@/app/garden/Inventory";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {AppHeader} from "@/components/app-header";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Leaf} from "lucide-react";

type CropType = 'wheat' | 'tomato' | 'grapes';

const CROP_COSTS: Record<CropType, number> = {
    wheat: 100,
    tomato: 300,
    grapes: 500,
};

type Bundle = {
    name: string;
    requirements: Record<CropType, number>;
    reward: number;
};

function calculateReward(requirements: Record<CropType, number>): number {
    let total = 0;
    for (const crop in requirements) {
        total += (CROP_COSTS[crop as CropType] || 0) * requirements[crop as CropType];
    }
    return Math.round(total * 1.5);
}

const SPECIAL_BUNDLES: Bundle[] = [
    {
        name: 'Super Harvest Bundle',
        requirements: {wheat: 3, tomato: 2, grapes: 1},
        reward: calculateReward({wheat: 3, tomato: 2, grapes: 1}),
    },
    {
        name: 'Tomato Lover Bundle',
        requirements: {wheat: 0, tomato: 999, grapes: 0},
        reward: calculateReward({wheat: 0, tomato: 999, grapes: 0}),
    },
    {
        name: "Winemaker's Delight",
        requirements: {wheat: 1, tomato: 0, grapes: 4},
        reward: calculateReward({wheat: 1, tomato: 0, grapes: 4}),
    },
];


export default function SpecialOrdersPage() {
    const [inventory, setInventory] = useState<Inventory | null>(null);
    const [bundleStatuses, setBundleStatuses] = useState<Record<number, 'success' | 'fail' | null>>({});
    const [userCrops, setUserCrops] = useState<{ [key in CropType]: number }>({ wheat: 0, tomato: 0, grapes: 0 });

    useEffect(() => {
        const loadInventory = async () => {
            const inv = new Inventory();
            const supabase = createClientComponentClient();
            const {data: {session}} = await supabase.auth.getSession();

            if (session?.user) {
                await inv.loadFromDatabase(supabase, session.user.id);
                // Fetch crops directly from Supabase (case-sensitive columns)
                const { data, error } = await supabase
                    .from('crops')
                    .select('Wheat, Tomato, Grapes')
                    .eq('user_id', session.user.id)
                    .single();
                if (data) {
                    setUserCrops({
                        wheat: data.Wheat ?? 0,
                        tomato: data.Tomato ?? 0,
                        grapes: data.Grapes ?? 0,
                    });
                }
            } else {
                console.warn("No user session found, using default zero inventory.");
            }

            console.log(inv.toString());
            setInventory(inv); // Trigger re-render with loaded inventory
        };

        loadInventory();
    }, []);

    const attemptBundleSubmit = async (bundleIndex: number) => {
        if (!inventory) return;

        const bundle = SPECIAL_BUNDLES[bundleIndex];
        // Use userCrops (from Supabase) for the check
        const hasAll = (['wheat', 'tomato', 'grapes'] as CropType[]).every(
            crop => userCrops[crop] >= bundle.requirements[crop]
        );

        setBundleStatuses(prev => ({
            ...prev,
            [bundleIndex]: hasAll ? 'success' : 'fail'
        }));

        if (hasAll) {
            // Add reward points to currency in Supabase
            const supabase = createClientComponentClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // Fetch current currency
                const { data: currencyData, error: currencyError } = await supabase
                    .from('currency')
                    .select('points')
                    .eq('user_id', session.user.id)
                    .single();
                if (!currencyError) {
                    const newPoints = (currencyData?.points ?? 0) + bundle.reward;
                    await supabase
                        .from('currency')
                        .upsert({ user_id: session.user.id, points: newPoints }, { onConflict: 'user_id' });
                }
                // Subtract crops from Supabase
                const newCrops = {
                    Wheat: (userCrops.wheat ?? 0) - (bundle.requirements.wheat ?? 0),
                    Tomato: (userCrops.tomato ?? 0) - (bundle.requirements.tomato ?? 0),
                    Grapes: (userCrops.grapes ?? 0) - (bundle.requirements.grapes ?? 0),
                };
                await supabase
                    .from('crops')
                    .update(newCrops)
                    .eq('user_id', session.user.id);
                // Refresh userCrops from Supabase
                const { data, error } = await supabase
                    .from('crops')
                    .select('Wheat, Tomato, Grapes')
                    .eq('user_id', session.user.id)
                    .single();
                if (data) {
                    setUserCrops({
                        wheat: data.Wheat ?? 0,
                        tomato: data.Tomato ?? 0,
                        grapes: data.Grapes ?? 0,
                    });
                }
            }
        }
    };


    if (!inventory) {
        return (
            <div className="min-h-screen bg-[#f5f2e9]">
                <AppHeader />
                <main className="container mx-auto px-4 py-8">
                    <div className="text-center">Loading...</div>
                </main>
            </div>
        )
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
                                <Card key={index} className="order-row bundle-card bg-[#f0ebe1] border-[#e5dfd3]">
                                    <CardHeader>
                                        <CardTitle className="text-[#5d6b5d]">{bundle.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {(['wheat', 'tomato', 'grapes'] as CropType[]).map(crop => (
                                            <div key={crop} className="mb-2">
                                                <h3 className="font-semibold">
                                                    {crop.charAt(0).toUpperCase() + crop.slice(1)}
                                                </h3>
                                                <p className="text-[#6c6c6c]">Available: {userCrops[crop]}</p>
                                                <p className="text-[#6c6c6c]">Required: {bundle.requirements[crop]}</p>
                                            </div>
                                        ))}
                                        <div className="mt-2 font-bold text-green-700">Reward: {bundle.reward} points</div>
                                    </CardContent>
                                    <div className="p-4 pt-0">
                                        <p className="min-h-[1.5rem] mb-2">
                                            {bundleStatuses[index] === 'success' && '✅ Bundle submitted!'}
                                            {bundleStatuses[index] === 'fail' && '❌ Not enough crops.'}
                                            {bundleStatuses[index] === null && '\u00A0'}
                                        </p>
                                        <Button className="w-full bg-[#6b8e6b] hover:bg-[#5d6b5d] text-white" onClick={() => attemptBundleSubmit(index)}>
                                            <Leaf className="h-4 w-4 mr-2" />
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
