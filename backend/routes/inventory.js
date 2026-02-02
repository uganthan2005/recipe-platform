const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const axios = require('axios');

// Add item to inventory
router.post('/', async (req, res) => {
    const { userId, item, quantity, expirationDate } = req.body;
    try {
        const inventoryItem = new Inventory({ userId, item, quantity, expirationDate });
        await inventoryItem.save();
        res.status(201).json(inventoryItem);
    } catch (error) {
        res.status(500).json({ error: 'Error adding item to inventory' });
    }
});

// Get inventory for a user
router.get('/', async (req, res) => { // Modified to use query or auth middleware usually, but PRD says GET /api/inventory. Assuming user ID is passed or handled via middleware later
    // For now, let's accept userId as query param or header if not using auth middleware yet.
    // But to match the previous implementation which used /:userId, I will keep /:userId for specific, but also / for global/current user if I had middleware.
    // PRD says: GET /api/inventory - Fetch all items for the current user.
    // I will assume we can pass userId in query for now: ?userId=...
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    try {
        const inventory = await Inventory.find({ userId: userId });
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching inventory' });
    }
});

// Get inventory by user ID param (Legacy support)
router.get('/:userId', async (req, res) => {
    try {
        const inventory = await Inventory.find({ userId: req.params.userId });
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching inventory' });
    }
});

// Scan item
router.post('/scan', async (req, res) => {
    const { barcode, userId } = req.body;

    try {
        // Query Open Food Facts API
        const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);

        if (response.data.status === 1) {
            const productData = response.data.product;
            const productName = productData.product_name || productData.generic_name || 'Unknown Product';
            const quantity = productData.quantity || '1 unit';

            // Construct simplified product object
            const product = {
                name: productName,
                quantity: quantity,
                image: productData.image_url
            };

            // Auto-save to inventory if userId provided
            if (userId) {
                const newItem = new Inventory({
                    userId,
                    item: product.name,
                    quantity: product.quantity,
                    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default 1 week shelf life
                });
                await newItem.save();
                return res.json({ product, inventoryItem: newItem, message: "Item scanned and added to pantry." });
            }

            return res.json({ product });
        } else {
            return res.status(404).json({ error: "Product not found in Open Food Facts database." });
        }
    } catch (e) {
        console.error("Scanning Error:", e);
        return res.status(500).json({ error: "Failed to process scan." });
    }
});

// Update inventory item
router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: 'Error updating inventory item' });
    }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting inventory item' });
    }
});

module.exports = router;
