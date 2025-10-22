const NFT_STORAGE_API_KEY = '93e6dfab.e69ac765fe56488ebd99f77ecb74be62';

export async function uploadToIPFS(data: any): Promise<string> {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const formData = new FormData();
  formData.append('file', blob, 'nakamas-pact.json');

  const response = await fetch('https://api.nft.storage/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${NFT_STORAGE_API_KEY}` },
    body: formData,
  });

  if (!response.ok) throw new Error('NFT.storage upload failed');
  const result = await response.json();
  return result.value.cid;
}

