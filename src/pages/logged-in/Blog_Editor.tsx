import '../../style.css';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const Blog_Editor: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [ed_author, setAuthor] = useState<string>('');
  const user_id_str: string | null = sessionStorage.getItem('currentUserId');
  const user_id: number = user_id_str ? parseInt(user_id_str, 10) : 0;

  const ed_blog_header: string | null = sessionStorage.getItem('editBlogId') !== null ? sessionStorage.getItem('editBlogHeader') : '';
  const ed_blog_body: string | null = sessionStorage.getItem('editBlogId') !== null ? sessionStorage.getItem('editBlogBody') : '';
  const blog_id_str: string | null = sessionStorage.getItem('editBlogId');
  const blog_id: number = blog_id_str ? parseInt(blog_id_str, 10) : 0;

  useEffect(() => {
    const profileSelect = async () => {
      const user_id_str = sessionStorage.getItem('currentUserId');
      if (!user_id_str) {
        setError('Missing user_id in session storage.');
        return;
      }
      const { data, error: queryError } = await supabase
        .from('user_table')
        .select('*')
        .eq('user_id', user_id)
        .single();
      
      if (queryError) {
        setError('Selection failed: ' + queryError.message);
      } else if (data) {
        setError(null);
        setAuthor(data.username || '');
      }
    };
    profileSelect();
  }, []);

  const [formData, setFormData] = useState({
    blog_header: '',
    blog_body: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  }

  const handleInsert = async (event: React.FormEvent) => {
    event.preventDefault();

    const editBlog = { author: ed_author, user_id: user_id, blog_header: formData.blog_header || ed_blog_header, blog_body: formData.blog_body || ed_blog_body };
    
    if (blog_id === 0 || blog_id_str === null || blog_id_str === '0') {
      const { error } = await supabase
        .from('blogs_table')
        .insert([editBlog]);

      if (error) {
        setError(error.message);
      } else {
        alert('User data inserted successfully!');
        window.location.href = '/myblogs';
      }
    } else {
      const { error } = await supabase
        .from('blogs_table')
        .update(editBlog)
        .eq('blog_id', blog_id);

      if (error) {
        setError(error.message);
      } else {
        alert('User data inserted successfully!');
        window.location.href = '/myblogs';
      }
    }
  };

  return (
    <>
      <h1>Blog Editor</h1>
      <div className="blog_editor">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleInsert}>
          <div className="author_info">
            <input type="text" className="form-control" id="username" value={ed_author} readOnly/>
            <input type="text" className="form-control" id="user_id" value={user_id} readOnly/>
          </div>
          <a>HEADER:</a>
          <p>{ed_blog_header}</p>
          <a>BODY:</a>
          <p className='blog_item_detail'>{ed_blog_body}</p>
          <div className="mb-3">
            <label htmlFor="blog_header" className="form-label">Header</label>
            <input type="text" className="form-control" id="blog_header" placeholder={ed_blog_header || ''} onChange={handleChange}/>
          </div>
          <div className="mb-3">
            <label htmlFor="blog_body" className="form-label">Body</label>
            <textarea className="form-control" id="blog_body" placeholder={ed_blog_body || ''} onChange={handleChange}/>
          </div>
          <button type="submit" className="btn btn-primary">
            {blog_id === 0 || blog_id_str === null || blog_id_str === '0' ? (
              <>Submit New Blog</>
            ) : (
              <>Confirm Edit Blog</>
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default Blog_Editor;