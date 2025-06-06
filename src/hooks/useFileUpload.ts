
import { useState } from 'react';
import { toast } from 'sonner';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!file) return null;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return null;
    }

    // Validate file size (max 5MB - reduced from 10MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 5MB');
      return null;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use correct API URL
      const apiUrl = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api';
      
      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error('Arquivo muito grande. Máximo 5MB.');
        }
        throw new Error('Erro no upload');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer upload da imagem');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading };
};
