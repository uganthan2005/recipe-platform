import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInventory, addItem } from '../store/inventorySlice';
import ScannerModal from '../components/ScannerModal';
import axios from 'axios';

const InventoryPage = () => {
    const dispatch = useDispatch();
    const inventory = useSelector((state) => state.inventory.items);
    const { user } = useSelector((state) => state.auth);
    const [isManualOpen, setIsManualOpen] = useState(false);
    const [manualItem, setManualItem] = useState({ item: '', quantity: '1', expirationDate: '' });
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
                alert("Failed to process barcode");
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
            alert("Failed to add item");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">My Pantry</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsManualOpen(true)}
                        className="bg-white text-gray-800 border border-gray-300 px-4 py-2 hover:bg-gray-100"
                    >
                        + Add
                    </button>
                    <button
                        onClick={() => setIsScannerOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
                    >
                        Scan
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-300">
                {inventory.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <p>Pantry is empty. Start scanning or add items!</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {inventory.map((item) => (
                            <li key={item._id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                <div>
                                    <p className="font-medium text-gray-900">{item.item}</p>
                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                </div>
                                <button className="text-red-600 hover:text-red-700">
                                    Delete
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
                    <div className="bg-white p-6 w-full max-w-md border border-gray-300">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Add Item Manually</h3>
                            <button onClick={() => setIsManualOpen(false)} className="text-gray-600 hover:text-gray-800">✕</button>
                        </div>
                        <form onSubmit={handleManualAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 p-2 focus:outline-none focus:border-gray-500"
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
                                    className="w-full border border-gray-300 p-2 focus:outline-none focus:border-gray-500"
                                    value={manualItem.quantity}
                                    onChange={e => setManualItem({ ...manualItem, quantity: e.target.value })}
                                    placeholder="e.g. 1 liter"
                                />
                            </div>
                            <button type="submit" className="w-full py-2 bg-blue-600 text-white font-bold hover:bg-blue-700">
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
