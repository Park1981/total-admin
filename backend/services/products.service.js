// 제품 관리 서비스
import { supabase } from '../lib/supabaseClient.js';

// 모든 제품 템플릿 조회
export async function getAllTemplates() {
  const { data, error } = await supabase
    .from('product_templates')
    .select(`
      *,
      product_options (
        option_id,
        option_type,
        option_type_label,
        option_value,
        option_label,
        is_default,
        sort_order
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('템플릿 조회 오류:', error);
    throw error;
  }

  return data;
}

// 새 제품 템플릿 생성
export async function createTemplate(templateData) {
  // 현재 사용자 ID는 임시로 하드코딩 (나중에 인증에서 가져와야 함)
  const dataToInsert = {
    ...templateData,
    created_by: null, // 임시로 null, 나중에 세션에서 가져오기
    status: 'active'
  };

  const { data, error } = await supabase
    .from('product_templates')
    .insert([dataToInsert])
    .select()
    .single();

  if (error) {
    console.error('템플릿 생성 오류:', error);
    throw error;
  }

  return data;
}

// 제품 템플릿 수정
export async function updateTemplate(templateId, templateData) {
  const { data, error } = await supabase
    .from('product_templates')
    .update({
      ...templateData,
      updated_at: new Date().toISOString()
    })
    .eq('template_id', templateId)
    .select()
    .single();

  if (error) {
    console.error('템플릿 수정 오류:', error);
    throw error;
  }

  return data;
}

// 제품 템플릿 삭제 (soft delete)
export async function deleteTemplate(templateId) {
  const { data, error } = await supabase
    .from('product_templates')
    .update({
      status: 'inactive',
      updated_at: new Date().toISOString()
    })
    .eq('template_id', templateId)
    .select()
    .single();

  if (error) {
    console.error('템플릿 삭제 오류:', error);
    throw error;
  }

  return data;
}

// 특정 템플릿의 옵션들 조회
export async function getTemplateOptions(templateId) {
  const { data, error } = await supabase
    .from('product_options')
    .select('*')
    .eq('template_id', templateId)
    .order('option_type')
    .order('sort_order');

  if (error) {
    console.error('옵션 조회 오류:', error);
    throw error;
  }

  return data;
}

// 새 제품 옵션 생성
export async function createOption(optionData) {
  const dataToInsert = {
    ...optionData,
    created_by: null, // 임시로 null, 나중에 세션에서 가져오기
    sort_order: optionData.sort_order || 0
  };

  const { data, error } = await supabase
    .from('product_options')
    .insert([dataToInsert])
    .select()
    .single();

  if (error) {
    console.error('옵션 생성 오류:', error);
    throw error;
  }

  return data;
}

// 제품 옵션 삭제
export async function deleteOption(optionId) {
  const { data, error } = await supabase
    .from('product_options')
    .delete()
    .eq('option_id', optionId)
    .select()
    .single();

  if (error) {
    console.error('옵션 삭제 오류:', error);
    throw error;
  }

  return data;
}

// 모든 제품 카테고리 조회
export async function getAllCategories() {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('category_name');

  if (error) {
    console.error('카테고리 조회 오류:', error);
    throw error;
  }

  return data;
}