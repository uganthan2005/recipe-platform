import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInventory, addItem } from '../store/inventorySlice';
import { Plus, Trash, Scan } from 'lucide-react';
import ScannerModal from '../components/ScannerModal';

import axios from 'axios';

const InventoryPage = () => {
    const dispatch = useDispatch();
    const inventory = useSelector((state) => state.inventory.items);
    const { user } = useSelector((state) => state.auth);
    const [isManualOpen, setIsManualOpen] = useState(false);
    const [manualItem, setManualItem] = useState({ item: '', quantity: '1', expirationDate: '' });

    // Restoring scanner logic
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchInventory(user.id));
        }
    }, [dispatch, user]);

    const handleScan = async (result) => {
        if (result) {
            try {
                const res = await axios.post('/api/inventory/scan', {
                    barcode: result.text,
                    userId: user?.id
                });
                if (res.data.inventoryItem) {
                    dispatch(addItem(res.data.inventoryItem));
                }
                setIsScannerOpen(false);
            } catch (error) {
                console.error("Scan failed:", error);
                alert("Failed to process barcode. Please try again.");
                setIsScannerOpen(false);
            }
        }
    };

    const handleManualAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/inventory', {
                userId: user?.id,
                item: manualItem.item,
                quantity: manualItem.quantity,
                expirationDate: manualItem.expirationDate
            });
            dispatch(addItem(res.data));
            setIsManualOpen(false);
            setManualItem({ item: '', quantity: '1', expirationDate: '' });
        } catch (error) {
            console.error("Add failed:", error);
            alert("Failed to add item.");
        }
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Pantry</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsManualOpen(true)}
                        className="flex items-center gap-2 bg-white text-orange-600 border border-orange-200 px-4 py-2 rounded-lg hover:bg-orange-50 transition"
                    >
                        <Plus size={20} /> Add
                    </button>
                    <button
                        onClick={() => setIsScannerOpen(true)}
                        className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                    >
                        <Scan size={20} /> Scan
                    </button>
                </div>
            </div>


            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {inventory.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <Scan className="mx-auto mb-2 text-gray-300" size={48} />
                        <p>Pantry is empty. Start scanning or add items!</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {inventory.map((item) => (
                            <li key={item._id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                <div>
                                    <p className="font-medium text-gray-900">{item.item}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <button className="text-red-400 hover:text-red-500">
                                    <Trash size={18} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {isScannerOpen && <ScannerModal onScan={handleScan} onClose={() => setIsScannerOpen(false)} />}

            {/* Manual Add Modal */}
            {isManualOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl transform transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Add Item Manually</h3>
                            <button onClick={() => setIsManualOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleManualAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-orange-500 focus:border-orange-500"
                                    value={manualItem.item}
                                    onChange={e => setManualItem({ ...manualItem, item: e.target.value })}
                                    placeholder="e.g. Milk"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-orange-500 focus:border-orange-500"
                                    value={manualItem.quantity}
                                    onChange={e => setManualItem({ ...manualItem, quantity: e.target.value })}
                                    placeholder="e.g. 1 liter"
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition">
                                Add to Pantry
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default InventoryPage;
