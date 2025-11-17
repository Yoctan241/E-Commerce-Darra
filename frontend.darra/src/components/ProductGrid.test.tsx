import { render, screen } from '@testing-library/react';
import ProductGrid from './ProductGrid';

describe('ProductGrid Component', () => {
  test('renders the main heading', () => {
    render(<ProductGrid />);
    
    const heading = screen.getByText('Produits Alimentaires Africains Authentiques');
    expect(heading).toBeInTheDocument();
  });

  test('displays no products message initially', () => {
    render(<ProductGrid />);
    
    const message = screen.getByText('Aucun produit n\'a été trouvé. Ajoutez des produits via l\'interface admin.');
    expect(message).toBeInTheDocument();
  });
});