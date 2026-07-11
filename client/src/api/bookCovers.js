// Utility to get cover images for books (supporting pre-defined covers for sample books)
export const getBookCover = (book) => {
  if (!book) return 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';

  // If there is an uploaded image, use it
  if (book.image && book.image.trim() !== '') {
    if (book.image.startsWith('http://') || book.image.startsWith('https://')) {
      return book.image;
    }
    return `http://localhost:8000/${book.image}`;
  }

  // Predefined high-quality public covers for the 5 sample books
  const title = book.title ? book.title.toLowerCase().trim() : '';

  if (title.includes('atomic habits')) {
    return 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg';
  }
  if (title.includes('alchemist')) {
    return 'https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg';
  }
  if (title.includes('think and grow rich')) {
    return 'https://covers.openlibrary.org/b/isbn/9781585424337-L.jpg';
  }
  if (title.includes('rich dad poor dad')) {
    return 'https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg';
  }
  if (title.includes('harry potter')) {
    return 'https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg';
  }
  if (title.includes('don\'t let her stay') || title.includes('dont let her stay')) {
    return 'https://covers.openlibrary.org/b/isbn/9781804364239-L.jpg';
  }
  if (title.includes('killing the witches')) {
    return 'https://covers.openlibrary.org/b/isbn/9781250283320-L.jpg';
  }
  if (title.includes('rich dad') || title.includes('poor dad')) {
    return 'https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg';
  }

  // Default clean book cover placeholder SVG
  return 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
};
