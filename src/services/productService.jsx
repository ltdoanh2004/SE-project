import { https } from './configURL';

export const fetchProducts = async () => {
    try {
        const response = await https.get('/jewelry');
        return response.data; // Assuming the API responds with an array of products
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};
