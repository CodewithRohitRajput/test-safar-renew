// Utility function to check if HTML content is empty
export const isHtmlContentEmpty = (htmlContent) => {
  if (!htmlContent) return true;
  
  // Remove HTML tags and check if there's any text content
  const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
  return textContent.length === 0;
};

// Utility function to get plain text from HTML
export const getPlainTextFromHtml = (htmlContent) => {
  if (!htmlContent) return '';
  return htmlContent.replace(/<[^>]*>/g, '').trim();
};


export const cleanHtmlContent = (htmlContent) => {
  if (!htmlContent) return '';
  
  
  let cleaned = htmlContent.replace(/<p><br><\/p>/g, '');
  cleaned = cleaned.replace(/<p><\/p>/g, '');
  
  
  cleaned = cleaned.replace(/<div><br><\/div>/g, '');
  cleaned = cleaned.replace(/<div><\/div>/g, '');
  
  return cleaned.trim();
};