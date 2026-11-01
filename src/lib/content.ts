import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from './language';
export function useContentRows() {
  return useQuery({queryKey:['site-content'],queryFn:async()=>{const {data,error}=await supabase.from('site_content').select('*');if(error)throw error;return data??[];},staleTime:60_000});
}
export function useContentText(section:string) {
  const language=useLanguage(); const {data=[]}=useContentRows();
  return {...language,t:(ar:string,en:string)=>{const row=data.find(r=>r.key===section+':'+ar);return row ? language.lang==='ar'?row.text_ar:row.text_en : language.t(ar,en);},image:(key:string,fallback:string)=>data.find(r=>r.key===key)?.image_url||fallback};
}