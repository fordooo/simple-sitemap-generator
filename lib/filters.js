const MIN_PRICE_RANGE = 500;
const MAX_PRICE_RANGE = 1000;
const PRICE_INTERVAL = 100;

const getPriceFilters = () => {
  let filters = [];
  for (let i = MIN_PRICE_RANGE; i <= MAX_PRICE_RANGE; i = i + PRICE_INTERVAL) {
    filters.push({
      [`under-${i}`]: {
        slug: `under-${i}`,
      },
    });
  }
  return filters;
};

const filters = {
  studios: {
    slug: "studios",
  },
  "1-bedroom": {
    slug: "1-bedroom",
  },
  "2-bedroom": {
    slug: "2-bedroom",
  },
  "3-bedroom": {
    slug: "3-bedroom",
  },
  "4-bedroom": {
    slug: "4-bedroom",
  },
  "pet-friendly": {
    slug: "pet-friendly",
  },
};

const FILTERS = Object.assign({}, filters, ...getPriceFilters());

module.exports = { FILTERS };
