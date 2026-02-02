import React, { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { X } from 'lucide-react';

const ScannerModal = ({ onScan, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="bg-white p-4 rounded-xl w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                    <X size={20} />
                </button>
                <h3 className="text-lg font-bold mb-4 text-center">Scan Barcode</h3>
                <div className="overflow-hidden rounded-lg aspect-square bg-black">
                    <BarcodeScannerComponent
                        width={500}
                        height={500}
                        onUpdate={(err, result) => {
                            if (result) onScan(result);
                        }}
                    />
                </div>
                <p className="text-center text-sm text-gray-500 mt-4">Point your camera at a food barcode</p>
            </div>
        </div>
    );
};
export default ScannerModal;
