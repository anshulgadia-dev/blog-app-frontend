export const imageURLResolver = (imagepath) => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  return `${backend_url}/${imagepath}`;
};
