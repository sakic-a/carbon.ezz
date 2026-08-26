import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { Package, MessageSquare, ShoppingBag, Trash2, Plus, Edit2, Sliders, Loader2, GripVertical, Image as ImageIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, rectSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CATEGORIES } from '../data/categories';
import { getImageUrl } from '../utils/imageUrl';
function SortableProductRow({ p, lang, reorderMode, onEdit, onDelete, onToggleStock }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 220ms ease',
    opacity: isDragging ? 0 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-3 border-b border-gray-100 last:border-0 bg-white hover:bg-gray-50"
    >
      {reorderMode && (
        <button
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing p-1 touch-none shrink-0 transition-colors"
          title="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={20} />
        </button>
      )}
      <img src={getImageUrl(p.image)} alt={p.name} className="w-12 h-12 object-cover rounded shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-bold truncate">{lang === 'bs' ? (p.nameBs || p.name) : p.name}</div>
        <div className="text-sm text-gray-500">€{Number(p.price).toFixed(2)} · {p.category}</div>
      </div>
      <div className="flex gap-2 items-center shrink-0">
        <button
          onClick={() => onToggleStock(p)}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
            p.is_in_stock !== false
              ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
              : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
          }`}
          title={lang === 'bs' ? 'Kliknite da promijenite stanje' : 'Click to toggle stock status'}
        >
          {p.is_in_stock !== false 
            ? (lang === 'bs' ? 'Na stanju' : 'In Stock')
            : (lang === 'bs' ? 'Nije na stanju' : 'Out of Stock')
          }
        </button>
        <button onClick={() => onEdit(p)} className="text-blue-500 hover:bg-blue-50 p-2 rounded transition-colors">
          <Edit2 size={20} />
        </button>
        <button onClick={() => onDelete(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}

function SortableGalleryItem({ img, onDelete, reorderMode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 220ms ease',
    opacity: isDragging ? 0 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50"
    >
      <img
          src={getImageUrl(img.src)}
          alt={img.alt || `Gallery Image ${img.id}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className={`absolute inset-0 bg-black/50 transition-opacity flex flex-col items-center justify-center gap-2 ${reorderMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {reorderMode ? (
              <button
                  type="button"
                  className="bg-white text-black p-2 rounded hover:bg-gray-200 transition-all duration-200 cursor-grab active:cursor-grabbing"
                  title="Drag to reorder"
                  {...attributes}
                  {...listeners}
              >
                  <GripVertical size={20} />
              </button>
          ) : (
              <button
                  type="button"
                  onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Are you sure you want to delete this image?")) {
                          onDelete(img.id);
                      }
                  }}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-all duration-200"
                  title="Delete Image"
                  onPointerDown={(e) => e.stopPropagation()}
              >
                  <Trash2 size={16} />
              </button>
          )}
      </div>
    </div>
  );
}

export default function Admin() {
    const { user, authLoading } = useAuth();
    const { t, lang } = useLanguage();
    const { products, addProduct, updateProduct, deleteProduct, galleryImages, addGalleryImages, reorderGalleryImages, deleteGalleryImage } = useShop();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [messages, setMessages] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');
    const [pName, setPName] = useState('');
    const [pNameBs, setPNameBs] = useState('');
    const [pPrice, setPPrice] = useState('');
    const [pCategory, setPCategory] = useState('accessories');
    const [pImage, setPImage] = useState('');
    const [pDescription, setPDescription] = useState('');
    const [pGallery, setPGallery] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);
    const [reorderMode, setReorderMode] = useState(false);
    const [orderedProducts, setOrderedProducts] = useState([]);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const [uploadingMain, setUploadingMain] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    const [dragOverMain, setDragOverMain] = useState(false);
    const [dragOverGallery, setDragOverGallery] = useState(false);
    const [dragOverGalleryTab, setDragOverGalleryTab] = useState(false);
    const [orderedGalleryImages, setOrderedGalleryImages] = useState([]);
    const [activeGalleryId, setActiveGalleryId] = useState(null);

    const handleMainImageUpload = async (file) => {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert("File is too large! Maximum limit is 5MB.");
            return;
        }
        setUploadingMain(true);
        const formData = new FormData();
        formData.append("image", file);
        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                credentials: "include",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setPImage(data.imageUrl);
            } else {
                alert(data.error || "Failed to upload image.");
            }
        } catch (err) {
            console.error("Upload failed", err);
            alert("An error occurred during upload.");
        } finally {
            setUploadingMain(false);
        }
    };

    const handleGalleryUpload = async (files) => {
        if (!files || files.length === 0) return;
        for (const file of files) {
            if (file.size > 5 * 1024 * 1024) {
                alert(`File "${file.name}" is too large! Maximum limit is 5MB.`);
                return;
            }
        }
        setUploadingGallery(true);
        const formData = new FormData();
        files.forEach((file) => formData.append("gallery", file));
        try {
            const res = await fetch("/api/upload-gallery", {
                method: "POST",
                credentials: "include",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setPGallery((prev) => [...prev, ...data.imageUrls]);
            } else {
                alert(data.error || "Failed to upload gallery images.");
            }
        } catch (err) {
            console.error("Gallery upload failed", err);
            alert("An error occurred during gallery upload.");
        } finally {
            setUploadingGallery(false);
        }
    };
    useEffect(() => {
        if (authLoading) return;
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetch('/api/admin/orders', { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setOrders(data);
            })
            .catch(err => console.error("Failed to load orders", err));
        fetch('/api/admin/messages', { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setMessages(data);
            })
            .catch(err => console.error("Failed to load messages", err));
        fetch('/api/admin/configurator-inquiries', { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setInquiries(data);
            })
            .catch(err => console.error("Failed to load configurator inquiries", err));
    }, [navigate, user, authLoading]);
    const handleStatusUpdate = async (orderId, status) => {
        try {
            await fetch(`/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ status })
            });
            setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };
    useEffect(() => {
        setOrderedProducts(products);
    }, [products]);

    useEffect(() => {
        setOrderedGalleryImages(galleryImages);
    }, [galleryImages]);

    const handleStartEdit = (p) => {
        setEditingProductId(p.id);
        setPName(p.name);
        setPNameBs(p.nameBs || '');
        setPPrice(p.price);
        setPCategory(p.category);
        setPImage(p.image);
        setPDescription(p.description || '');
        setPGallery(p.gallery || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggleStock = async (product) => {
        await updateProduct(product.id, {
            name: product.name,
            nameBs: product.nameBs,
            price: parseFloat(product.price),
            category: product.category,
            image: product.image,
            description: product.description,
            gallery: product.gallery,
            isInStock: product.is_in_stock === false
        });
    };

    const handleDragStart = ({ active }) => setActiveId(active.id);

    const handleDragEnd = ({ active, over }) => {
        setActiveId(null);
        if (!over || active.id === over.id) return;
        setOrderedProducts(prev => {
            const oldIndex = prev.findIndex(p => p.id === active.id);
            const newIndex = prev.findIndex(p => p.id === over.id);
            return arrayMove(prev, oldIndex, newIndex);
        });
    };

    const handleGalleryDragStart = ({ active }) => setActiveGalleryId(active.id);

    const handleGalleryDragEnd = ({ active, over }) => {
        setActiveGalleryId(null);
        if (!over || active.id === over.id) return;
        setOrderedGalleryImages(prev => {
            const oldIndex = prev.findIndex(img => img.id === active.id);
            const newIndex = prev.findIndex(img => img.id === over.id);
            return arrayMove(prev, oldIndex, newIndex);
        });
    };

    const handleSaveGalleryReorder = async () => {
        try {
            const reordered = orderedGalleryImages.map((img, idx) => ({
                id: img.id,
                sort_order: idx
            }));
            await reorderGalleryImages(reordered);
            setReorderMode(false);
        } catch (err) {
            console.error('Failed to save gallery order', err);
            alert('Failed to save order. Please try again.');
        }
    };

    const handleSaveReorder = async () => {
        try {
            const res = await fetch('/api/products/reorder', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ orderedIds: orderedProducts.map(p => p.id) }),
            });
            if (!res.ok) throw new Error(`${res.status}`);
            setReorderMode(false);
        } catch (err) {
            console.error('Failed to save order', err);
            alert('Failed to save order. Please try again.');
        }
    };

    const handleAddProduct = (e) => {
        e.preventDefault();
        const galleryArray = pGallery;
        if (editingProductId) {
            updateProduct(editingProductId, {
                name: pName,
                nameBs: pNameBs,
                price: parseFloat(pPrice),
                category: pCategory,
                image: pImage,
                description: pDescription,
                gallery: galleryArray,
                isInStock: products.find(prod => prod.id === editingProductId)?.is_in_stock !== false
            });
            setEditingProductId(null);
        } else {
            addProduct({
                name: pName,
                nameBs: pNameBs,
                price: parseFloat(pPrice),
                category: pCategory,
                image: pImage,
                description: pDescription,
                gallery: galleryArray,
                isInStock: true
            });
        }
        setPName('');
        setPNameBs('');
        setPPrice('');
        setPDescription('');
        setPGallery([]);
        setPImage('');
        setPCategory('accessories');
    };
    const handleReply = async (msgId, replyText) => {
        try {
            const res = await fetch(`/api/messages/${msgId}/reply`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ reply: replyText })
            });
            const data = await res.json();
            if (data.success) {
                setMessages(messages.map(m => m.id === msgId ? { ...m, reply: replyText } : m));
            }
        } catch (err) {
            console.error("Failed to reply", err);
        }
    };
    const handleDeleteInquiry = async (inquiryId) => {
        if (!window.confirm(t('faq', 'confirmDelete') || "Are you sure you want to delete this inquiry?")) return;
        try {
            const res = await fetch(`/api/admin/configurator-inquiries/${inquiryId}`, {
                method: 'DELETE',
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                setInquiries(inquiries.filter(i => i.id !== inquiryId));
            }
        } catch (err) {
            console.error("Failed to delete inquiry", err);
        }
    };
    const handleInquiryReply = async (inqId, replyText) => {
        try {
            const res = await fetch(`/api/admin/configurator-inquiries/${inqId}/reply`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ reply: replyText })
            });
            const data = await res.json();
            if (data.success) {
                setInquiries(inquiries.map(i => i.id === inqId ? { ...i, reply: replyText } : i));
            }
        } catch (err) {
            console.error("Failed to reply to configurator inquiry", err);
        }
    };
    if (authLoading || !user || user.role !== 'admin') return null;
    return (
        <div className="py-16 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 text-primary">{t('admin', 'title')}</h1>
                <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
                    <div className="bg-white p-5 rounded-lg shadow-sm h-fit">
                        <button
                            className={`flex items-center gap-3 w-full p-3 rounded mb-2 text-left transition-colors ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            onClick={() => { setActiveTab('orders'); setReorderMode(false); }}
                        >
                            <Package size={20} /> {t('admin', 'orders')}
                        </button>
                        <button
                            className={`flex items-center gap-3 w-full p-3 rounded mb-2 text-left transition-colors ${activeTab === 'products' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            onClick={() => setActiveTab('products')}
                        >
                            <ShoppingBag size={20} /> {t('admin', 'products')}
                        </button>
                        <button
                            className={`flex items-center gap-3 w-full p-3 rounded mb-2 text-left transition-colors ${activeTab === 'inquiries' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            onClick={() => { setActiveTab('inquiries'); setReorderMode(false); }}
                        >
                            <Sliders size={20} /> {t('admin', 'inquiries')}
                        </button>
                        <button
                            className={`flex items-center gap-3 w-full p-3 rounded mb-2 text-left transition-colors ${activeTab === 'messages' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            onClick={() => { setActiveTab('messages'); setReorderMode(false); }}
                        >
                            <MessageSquare size={20} /> {t('admin', 'messages')}
                        </button>
                        <button
                            className={`flex items-center gap-3 w-full p-3 rounded mb-2 text-left transition-colors ${activeTab === 'gallery' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            onClick={() => { setActiveTab('gallery'); setReorderMode(false); }}
                        >
                            <ImageIcon size={20} /> Gallery
                        </button>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-sm min-w-0 overflow-hidden">
                        {activeTab === 'orders' && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">{t('admin', 'orders')}</h2>
                                {orders.length === 0 ? (
                                    <p className="text-gray-500">{t('admin', 'noOrders')}</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="p-3 font-semibold text-gray-500">Date</th>
                                                    <th className="p-3 font-semibold text-gray-500">Customer</th>
                                                    <th className="p-3 font-semibold text-gray-500">Total</th>
                                                    <th className="p-3 font-semibold text-gray-500">Items</th>
                                                    <th className="p-3 font-semibold text-gray-500">Shipping</th>
                                                    <th className="p-3 font-semibold text-gray-500">Status</th>
                                                    <th className="p-3 font-semibold text-gray-500">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map(order => (
                                                    <tr key={order.id} className="border-b border-gray-100 last:border-0">
                                                        <td className="p-3">{order.created_at ? new Date(order.created_at).toLocaleDateString("en-GB") : "—"}</td>
                                                        <td className="p-3 font-medium">{order.user}</td>
                                                        <td className="p-3">€{Number(order.total).toFixed(2)}</td>
                                                        <td className="p-3 text-sm text-gray-600">
                                                            {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                                                        </td>
                                                        <td className="p-3 text-sm">
                                                            {order.shipping ? (
                                                                <div>
                                                                    {order.shipping.address}, {order.shipping.city}
                                                                    <br />
                                                                    <span className="text-gray-400">{order.shipping.phone}</span>
                                                                </div>
                                                            ) : '-'}
                                                        </td>
                                                        <td className="p-3">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                                order.status === 'Declined' ? 'bg-red-100 text-red-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                                }`}>
                                                                {order.status || 'Pending'}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 flex gap-2">
                                                            {(!order.status || order.status === 'Pending') && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(order.id, 'Approved')}
                                                                        className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                                                                    >
                                                                        Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(order.id, 'Declined')}
                                                                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                                                                    >
                                                                        Decline
                                                                    </button>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'products' && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">{t('admin', 'products')}</h2>
                                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-8">
                                    <h3 className="font-bold mb-4">{editingProductId ? t('admin', 'editProduct') : t('admin', 'addProduct')}</h3>
                                    <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">{t('admin', 'productName')} (EN)</label>
                                            <input className="w-full p-2 border rounded" value={pName} onChange={(e) => setPName(e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">{t('admin', 'productName')} (BS)</label>
                                            <input className="w-full p-2 border rounded" value={pNameBs} onChange={(e) => setPNameBs(e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">{t('admin', 'productPrice')}</label>
                                            <div className="relative rounded-lg shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">€</span>
                                                </div>
                                                <input 
                                                    type="number" 
                                                    step="0.01" 
                                                    className="w-full pl-8 p-2 border rounded outline-none focus:border-primary transition-colors" 
                                                    value={pPrice} 
                                                    onChange={(e) => setPPrice(e.target.value)} 
                                                    required 
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">{t('admin', 'productCategory')}</label>
                                            <select className="w-full p-2 border rounded" value={pCategory} onChange={e => setPCategory(e.target.value)}>
                                                {CATEGORIES.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-bold text-gray-700">{t('admin', 'productImage')}</label>
                                            <div className="mt-1 flex flex-col items-start">
                                                {pImage ? (
                                                    <div className="relative group w-full max-w-[200px] h-[150px] rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                                                        <img
                                                            src={getImageUrl(pImage)}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => setPImage("")}
                                                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 scale-90 group-hover:scale-100"
                                                                title="Remove Image"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label
                                                        className={`w-full max-w-[250px] h-[140px] flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-all group ${dragOverMain ? 'border-primary bg-yellow-50/40 scale-[1.02]' : 'border-gray-300 hover:border-primary hover:bg-yellow-50/20'}`}
                                                        onDragOver={(e) => { e.preventDefault(); setDragOverMain(true); }}
                                                        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOverMain(false); }}
                                                        onDrop={(e) => { e.preventDefault(); setDragOverMain(false); handleMainImageUpload(e.dataTransfer.files[0]); }}
                                                    >
                                                        {uploadingMain ? (
                                                            <div className="flex flex-col items-center justify-center">
                                                                <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                                                                <span className="text-xs text-gray-500 font-medium">{t('admin', 'uploadingImage')}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center p-4 text-center">
                                                                <Plus className={`w-8 h-8 transition-colors mb-2 ${dragOverMain ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                                                                <span className={`text-sm font-semibold transition-colors ${dragOverMain ? 'text-primary' : 'text-gray-700 group-hover:text-primary'}`}>{dragOverMain ? 'Drop to upload' : t('admin', 'chooseMainImage')}</span>
                                                                <span className="text-xs text-gray-400 mt-1">{t('admin', 'maxSizeNotice')}</span>
                                                            </div>
                                                        )}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            disabled={uploadingMain}
                                                            onChange={(e) => handleMainImageUpload(e.target.files[0])}
                                                            required
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block mb-2 text-sm font-bold text-gray-700">{t('admin', 'productGallery')}</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                                {pGallery.map((img, idx) => (
                                                    <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                                                        <img
                                                            src={getImageUrl(img)}
                                                            alt={`Gallery preview ${idx}`}
                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setPGallery(pGallery.filter((_, i) => i !== idx));
                                                                }}
                                                                className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all duration-200 scale-90 group-hover:scale-100"
                                                                title="Delete Image"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}

                                                {uploadingGallery && (
                                                    <div className="aspect-square flex flex-col items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
                                                        <Loader2 className="w-6 h-6 text-primary animate-spin mb-1" />
                                                        <span className="text-[10px] text-gray-400">{t('admin', 'uploading')}</span>
                                                    </div>
                                                )}

                                                {pGallery.length < 10 && !uploadingGallery && (
                                                    <label
                                                        className={`aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-all group ${dragOverGallery ? 'border-primary bg-yellow-50/40 scale-[1.04]' : 'border-gray-300 hover:border-primary hover:bg-yellow-50/20'}`}
                                                        onDragOver={(e) => { e.preventDefault(); setDragOverGallery(true); }}
                                                        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOverGallery(false); }}
                                                        onDrop={(e) => { e.preventDefault(); setDragOverGallery(false); handleGalleryUpload(Array.from(e.dataTransfer.files)); }}
                                                    >
                                                        <Plus className={`w-6 h-6 transition-colors ${dragOverGallery ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                                                        <span className={`text-xs font-semibold transition-colors mt-1 ${dragOverGallery ? 'text-primary' : 'text-gray-700 group-hover:text-primary'}`}>{dragOverGallery ? 'Drop here' : t('admin', 'addImage')}</span>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handleGalleryUpload(Array.from(e.target.files))}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block mb-1 text-sm font-medium">{t('admin', 'description')}</label>
                                            <textarea className="w-full p-2 border rounded h-24" value={pDescription} onChange={e => setPDescription(e.target.value)} placeholder={t('admin', 'productDetailsPlaceholder')}></textarea>
                                        </div>
                                        <div className="md:col-span-2 flex gap-2">
                                            <button 
                                                type="submit" 
                                                disabled={uploadingMain || uploadingGallery}
                                                className="flex items-center gap-2 bg-primary text-black font-bold px-5 py-2 rounded-xl hover:bg-yellow-400 disabled:opacity-50 transition-colors"
                                            >
                                                {editingProductId ? <Edit2 size={18} /> : <Plus size={18} />} {editingProductId ? t('admin', 'update') : t('admin', 'save')}
                                            </button>
                                            {editingProductId && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        setEditingProductId(null);
                                                        setPName('');
                                                        setPNameBs('');
                                                        setPPrice('');
                                                        setPDescription('');
                                                        setPGallery([]);
                                                        setPImage('');
                                                        setPCategory('accessories');
                                                    }} 
                                                    className="bg-gray-200 text-gray-700 font-semibold px-5 py-2 rounded-xl hover:bg-gray-300 transition-colors"
                                                >
                                                    {t('admin', 'cancel')}
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                                <div className="flex justify-end mb-4">
                                    <button
                                        onClick={() => reorderMode ? handleSaveReorder() : setReorderMode(true)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${reorderMode ? 'bg-primary text-black shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        <GripVertical size={15} />
                                        {reorderMode ? t('admin', 'reorderDone') : t('admin', 'reorder')}
                                    </button>
                                </div>
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={orderedProducts.map(p => p.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="divide-y divide-gray-100 rounded-lg overflow-hidden border border-gray-100">
                                            {orderedProducts.map(p => (
                                                <SortableProductRow
                                                    key={p.id}
                                                    p={p}
                                                    lang={lang}
                                                    reorderMode={reorderMode}
                                                    onEdit={handleStartEdit}
                                                    onDelete={deleteProduct}
                                                    onToggleStock={handleToggleStock}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                    <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
                                        {activeId ? (() => {
                                            const p = orderedProducts.find(x => x.id === activeId);
                                            return p ? (
                                                <div className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-2xl border-2 border-primary">
                                                    <GripVertical size={20} className="text-primary shrink-0" />
                                                    <img src={getImageUrl(p.image)} alt={p.name} className="w-12 h-12 object-cover rounded shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-bold truncate">{lang === 'bs' ? (p.nameBs || p.name) : p.name}</div>
                                                        <div className="text-sm text-gray-500">€{Number(p.price).toFixed(2)} · {p.category}</div>
                                                    </div>
                                                </div>
                                            ) : null;
                                        })() : null}
                                    </DragOverlay>
                                </DndContext>
                            </div>
                        )}
                        {activeTab === 'messages' && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">{t('admin', 'messages')}</h2>
                                {messages.length === 0 ? (
                                    <p className="text-gray-500">No messages received yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map(msg => (
                                            <div key={msg.id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex flex-col md:flex-row justify-between border-b border-gray-100 pb-4 mb-4 gap-4">
                                                    <div className="min-w-0">
                                                        <h3 className="font-extrabold text-lg text-black break-words">{msg.name}</h3>
                                                        <p className="text-sm text-gray-500 break-words">
                                                            {msg.email}
                                                            {msg.phone && <a href={`tel:${msg.phone}`} className="ml-2 font-medium bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600 hover:bg-gray-200">{msg.phone}</a>}
                                                        </p>
                                                    </div>
                                                    <div className="text-right text-sm text-gray-400 font-semibold self-start md:self-center">
                                                        {msg.created_at ? new Date(msg.created_at).toLocaleString() : "—"}
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm mb-4">
                                                    <h4 className="font-bold text-gray-800 mb-2 uppercase tracking-wider text-xs">Message:</h4>
                                                    <p className="text-gray-700 whitespace-pre-wrap break-words">{msg.message}</p>
                                                </div>
                                                {msg.reply ? (
                                                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 mt-4">
                                                        <strong className="text-green-800 text-xs block mb-1">Reply:</strong>
                                                        <p className="text-green-900 whitespace-pre-wrap break-words">{msg.reply}</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2 mt-4">
                                                        <input
                                                            type="text"
                                                            placeholder="Type a reply..."
                                                            className="flex-1 border p-2 rounded-xl text-sm outline-none focus:border-black"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleReply(msg.id, e.target.value);
                                                                    e.target.value = '';
                                                                }
                                                            }}
                                                        />
                                                        <button
                                                            className="bg-primary text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-yellow-400"
                                                            onClick={(e) => {
                                                                const input = e.target.previousSibling;
                                                                handleReply(msg.id, input.value);
                                                                input.value = '';
                                                            }}
                                                        >
                                                            Send
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'inquiries' && (
                            <div>
                                <h2 className="text-xl font-bold mb-6">{t('admin', 'inquiries')}</h2>
                                {inquiries.length === 0 ? (
                                    <p className="text-gray-500">{t('admin', 'noInquiries')}</p>
                                ) : (
                                    <div className="space-y-4">
                                        {inquiries.map(inq => (
                                            <div key={inq.id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow relative">
                                                <button
                                                    onClick={() => handleDeleteInquiry(inq.id)}
                                                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                                                    title={t('admin', 'delete')}
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                                <div className="flex flex-col md:flex-row justify-between border-b border-gray-100 pb-4 mb-4 gap-4">
                                                    <div className="min-w-0">
                                                        <h3 className="font-extrabold text-lg text-black break-words">{inq.name}</h3>
                                                        <p className="text-sm text-gray-500 break-words">{inq.email} {inq.phone && <a href={`tel:${inq.phone}`} className="ml-2 font-medium bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600 hover:bg-gray-200">{inq.phone}</a>}</p>
                                                    </div>
                                                    <div className="text-right md:text-right text-sm text-gray-400 font-semibold self-start md:self-center">
                                                        {new Date(inq.created_at).toLocaleString()}
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm mb-4">
                                                    <h4 className="font-bold text-gray-800 mb-2 uppercase tracking-wider text-xs">Specification:</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-gray-600 capitalize">
                                                        <div><span className="font-semibold">Model:</span> {inq.selected_model}</div>
                                                        <div><span className="font-semibold">Car Model:</span> {inq.car_model}</div>
                                                        <div><span className="font-semibold">Shape:</span> {t('configurator', inq.wheel_shape) || inq.wheel_shape}</div>
                                                        <div><span className="font-semibold">Top Grip:</span> {t('configurator', inq.top_material) || inq.top_material}</div>
                                                        <div><span className="font-semibold">Side Grips:</span> {t('configurator', inq.side_material) || inq.side_material}</div>
                                                        <div><span className="font-semibold">Bottom Grip:</span> {t('configurator', inq.bottom_material) || inq.bottom_material}</div>
                                                        <div>
                                                            <span className="font-semibold">Stitching:</span>{" "}
                                                            <span className="inline-flex items-center gap-1.5 font-medium text-black">
                                                                <span 
                                                                    className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                                                                    style={{ 
                                                                        backgroundColor: inq.thread_colour === 'white' ? '#ffffff' : 
                                                                                        inq.thread_colour === 'black' ? '#000000' : inq.thread_colour 
                                                                    }}
                                                                />
                                                                {inq.thread_colour}
                                                            </span>
                                                        </div>
                                                        <div className="col-span-2 md:col-span-3">
                                                            <span className="font-semibold">Ring:</span>{" "}
                                                            {inq.ring_enabled ? (
                                                                <span className="inline-flex items-center gap-1.5 font-medium text-black">
                                                                    <span 
                                                                        className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                                                                        style={{ backgroundColor: inq.ring_colour }}
                                                                    />
                                                                    {inq.ring_colour}
                                                                </span>
                                                            ) : (
                                                                "No Ring"
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {inq.notes && (
                                                    <div className="bg-yellow-50/50 rounded-xl p-4 border border-yellow-100 text-sm">
                                                        <h4 className="font-bold text-yellow-800 mb-1 uppercase tracking-wider text-xs">Customer Notes:</h4>
                                                        <p className="text-gray-700 italic break-words">&quot;{inq.notes}&quot;</p>
                                                    </div>
                                                )}

                                                {inq.reply ? (
                                                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 mt-4">
                                                        <strong className="text-green-800 text-xs block mb-1">Reply:</strong>
                                                        <p className="text-green-900 whitespace-pre-wrap break-words">{inq.reply}</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2 mt-4">
                                                        <input
                                                            type="text"
                                                            placeholder="Type a price offer or reply..."
                                                            className="flex-1 border p-2 rounded-xl text-sm outline-none focus:border-black"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleInquiryReply(inq.id, e.target.value);
                                                                    e.target.value = '';
                                                                }
                                                            }}
                                                        />
                                                        <button
                                                            className="bg-primary text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-yellow-400"
                                                            onClick={(e) => {
                                                                const input = e.target.previousSibling;
                                                                handleInquiryReply(inq.id, input.value);
                                                                input.value = '';
                                                            }}
                                                        >
                                                            Send
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Gallery</h2>
                                    <div className="flex gap-2">
                                        {reorderMode ? (
                                            <>
                                                <button onClick={() => { setReorderMode(false); setOrderedGalleryImages(galleryImages); }} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-300">
                                                    {t('admin', 'cancel') || 'Cancel'}
                                                </button>
                                                <button onClick={handleSaveGalleryReorder} className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-600">
                                                    {t('admin', 'reorderDone') || 'Save Order'}
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => setReorderMode(true)} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50">
                                                <GripVertical size={16} /> {t('admin', 'reorder') || 'Reorder'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    {uploadingGallery ? (
                                        <div className="w-full h-32 flex flex-col items-center justify-center border-2 border-gray-200 border-dashed rounded-xl bg-gray-50">
                                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                                            <span className="text-sm text-gray-500 font-medium">{t('admin', 'uploadingImage') || 'Uploading...'}</span>
                                        </div>
                                    ) : (
                                        <label
                                            className={`w-full h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all group ${dragOverGalleryTab ? 'border-primary bg-yellow-50/40 scale-[1.01]' : 'border-gray-300 hover:border-primary hover:bg-yellow-50/20'}`}
                                            onDragOver={(e) => { e.preventDefault(); setDragOverGalleryTab(true); }}
                                            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOverGalleryTab(false); }}
                                            onDrop={async (e) => { 
                                                e.preventDefault(); 
                                                setDragOverGalleryTab(false);
                                                const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                                                if (files.length === 0) return;
                                                setUploadingGallery(true);
                                                try {
                                                    const formData = new FormData();
                                                    files.forEach(f => formData.append('gallery', f));
                                                    const res = await fetch('/api/upload-gallery', {
                                                        method: 'POST',
                                                        headers: {
                                                            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                                                        },
                                                        credentials: 'include',
                                                        body: formData
                                                    });
                                                    const data = await res.json();
                                                    if (data.success) {
                                                        await addGalleryImages(data.imageUrls.map(url => ({ src: url })));
                                                    } else {
                                                        alert(data.error || "Upload failed");
                                                    }
                                                } catch (err) {
                                                    console.error(err);
                                                    alert("Upload failed");
                                                }
                                                setUploadingGallery(false);
                                            }}
                                        >
                                            <Plus className={`w-8 h-8 transition-colors mb-2 ${dragOverGalleryTab ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                                            <span className={`text-sm font-semibold transition-colors ${dragOverGalleryTab ? 'text-primary' : 'text-gray-700 group-hover:text-primary'}`}>
                                                {dragOverGalleryTab ? 'Drop images here' : (t('admin', 'addImage') || 'Add New Images')}
                                            </span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={async (e) => {
                                                    const files = Array.from(e.target.files);
                                                    if (files.length === 0) return;
                                                    setUploadingGallery(true);
                                                    try {
                                                        const formData = new FormData();
                                                        files.forEach(f => formData.append('gallery', f));
                                                        const res = await fetch('/api/upload-gallery', {
                                                            method: 'POST',
                                                            headers: {
                                                                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                                                            },
                                                            credentials: 'include',
                                                            body: formData
                                                        });
                                                        const data = await res.json();
                                                        if (data.success) {
                                                            await addGalleryImages(data.imageUrls.map(url => ({ src: url })));
                                                        } else {
                                                            alert(data.error || "Upload failed");
                                                        }
                                                    } catch (err) {
                                                        console.error(err);
                                                        alert("Upload failed");
                                                    }
                                                    setUploadingGallery(false);
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>

                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleGalleryDragStart} onDragEnd={handleGalleryDragEnd}>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        <SortableContext items={orderedGalleryImages.map(img => img.id)} strategy={rectSortingStrategy}>
                                            {orderedGalleryImages.map((img) => (
                                                <SortableGalleryItem
                                                    key={img.id}
                                                    img={img}
                                                    onDelete={deleteGalleryImage}
                                                    reorderMode={reorderMode}
                                                />
                                            ))}
                                        </SortableContext>
                                    </div>
                                    <DragOverlay>
                                        {activeGalleryId ? (
                                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-primary shadow-xl bg-white opacity-80 scale-105">
                                                <img
                                                    src={getImageUrl(orderedGalleryImages.find(img => img.id === activeGalleryId)?.src)}
                                                    alt="Dragging"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : null}
                                    </DragOverlay>
                                </DndContext>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
