import ellipse from '../../assets/product-card-ellipse.svg';
import carArt from '../../assets/illus-car.svg';
import creditCardArt from '../../assets/illus-credit-card.svg';
import homeArt from '../../assets/illus-home.svg';
import personalCoinArt from '../../assets/illus-personal-coin.svg';
import personalHandArt from '../../assets/illus-personal-hand.svg';
import { BrandMark } from '../../components/BrandMark';
import { Button } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { CATEGORIES, PRODUCTS } from '../data';
import type { CategoryId, ProductId } from '../data';
import './ProductSelectScreen.css';

type ProductSelectScreenProps = {
  category: CategoryId;
  product: ProductId | null;
  onCategoryChange: (category: CategoryId) => void;
  onProductChange: (product: ProductId) => void;
  onContinue: () => void;
};

export function ProductSelectScreen({
  category,
  product,
  onCategoryChange,
  onProductChange,
  onContinue,
}: ProductSelectScreenProps) {
  return (
    <Screen
      footer={
        <Button disabled={!product} onClick={onContinue}>
          Continue
        </Button>
      }
    >
      <div className="brand-header">
        <BrandMark />
        <h1 className="brand-header__title">Which products are you interested in?</h1>
      </div>

      <div className="products">
        {/* The design has no product-to-category mapping yet, so tabs only switch their active state. */}
        <div className="category-tabs" role="group" aria-label="Product category">
          {CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              className="category-tab"
              aria-pressed={item.id === category}
              onClick={() => onCategoryChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <fieldset className="product-list">
          <legend className="visually-hidden">Choose a product</legend>
          {PRODUCTS.map((item) => {
            const selected = item.id === product;
            return (
              <label key={item.id} className="product-card" data-selected={selected || undefined}>
                <input
                  type="radio"
                  name="product"
                  className="visually-hidden"
                  value={item.id}
                  checked={selected}
                  onChange={() => onProductChange(item.id)}
                />
                <img className="product-card__ellipse" src={ellipse} width={225} height={225} alt="" />
                <ProductArt product={item.id} />
                <span className="product-card__eyebrow">{item.eyebrow}</span>
                <span className="product-card__name">{item.name}</span>
              </label>
            );
          })}
        </fieldset>
      </div>
    </Screen>
  );
}

/** Illustration slot of the Figma "Product Card", positioned per product as in the design. */
function ProductArt({ product }: { product: ProductId }) {
  switch (product) {
    case 'credit-card':
      return (
        <span className="product-art product-art--credit-card" aria-hidden="true">
          <img src={creditCardArt} width={110.129} height={103.262} alt="" />
        </span>
      );
    case 'personal-finance':
      return (
        <span className="product-art product-art--personal" aria-hidden="true">
          <img className="product-art__hand" src={personalHandArt} width={102.223} height={49.914} alt="" />
          <img className="product-art__coin" src={personalCoinArt} width={61.893} height={61.894} alt="" />
        </span>
      );
    case 'home-finance':
      return (
        <span className="product-art product-art--home" aria-hidden="true">
          <img src={homeArt} width={96} height={90.028} alt="" />
        </span>
      );
    case 'auto-finance':
      return (
        <span className="product-art product-art--car" aria-hidden="true">
          <img src={carArt} width={123} height={123} alt="" />
        </span>
      );
  }
}
