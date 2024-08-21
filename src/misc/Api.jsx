export const getCsrfToken = async () => {
    const response = await fetch('http://localhost:8000/misc/csrf/');
    const data = await response.json();
    return data;
  };

export const getCsrfTokenFromCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};


export const checkUserAuth = async () => {
try {
    const response = await fetch('http://localhost:8000/misc/user_check/', {
    method: 'GET',
    credentials: 'include' 
    });
    if (!response.ok) {
    throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.is_authenticated;
} catch (error) {
    console.error('Error fetching authentication status:', error);
    return false;
}
};