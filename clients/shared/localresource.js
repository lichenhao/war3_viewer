/**
 * Local Resource Loader with Proxy Caching
 * 
 * This module provides a resource loading mechanism that:
 * 1. Requests resources through the local Vite proxy at /resources/
 * 2. The Vite proxy checks local cache first, then fetches from remote if needed
 * 3. All resources are transparently cached locally
 */

class LocalResourceLoader {
  constructor() {
    this.isBrowser = typeof window !== 'undefined';
  }

  /**
   * Load a resource through the local proxy
   * @param {string} src - The resource path
   * @param {Object} params - Additional parameters (unused in this implementation)
   * @returns {Promise<string|ArrayBuffer>} The resource data
   */
  async load(src) {
    try {
      // Construct proxy URL
      const proxyUrl = `/resources/${src}`;
      
      // Fetch through the proxy
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to load resource ${src}: ${response.status} ${response.statusText}`);
      }
      
      // Determine the appropriate response type based on file extension
      const extension = src.split('.').pop().toLowerCase();
      if (['mdx', 'mdl', 'blp', 'dds', 'tga', 'w3x', 'w3m', 'j', 'lua'].includes(extension)) {
        return await response.arrayBuffer();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error(`Failed to load resource ${src}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
const localResourceLoader = new LocalResourceLoader();
export default localResourceLoader;

// Export the class for potential custom instantiation
export { LocalResourceLoader };
