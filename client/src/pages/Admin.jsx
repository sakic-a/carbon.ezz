import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { Package, MessageSquare, ShoppingBag, Trash2, Plus, Edit2 } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
export default function Admin() {
    const { user, getToken } = useAuth();
    const { t } = useLanguage();
    const { products, addProduct, updateProduct, deleteProduct } = useShop();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');
    const [pName, setPName] = useState('');
    const [pPrice, setPPrice] = useState('');
    const [pCategory, setPCategory] = useState('accessories');
    const [pImage, setPImage] = useState('');
    const [pDescription, setPDescription] = useState('');
    const [pGallery, setPGallery] = useState('');
    const [editingProductId, setEditingProductId] = useState(null);
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || storedUser.role !== 'admin') {
            navigate('/login');
        }
        fetch('http://localhost:5001/api/admin/orders', {
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setOrders(data);
            })
            .catch(err => console.error("Failed to load orders", err));
        fetch('http://localhost:5001/api/admin/messages', {
            headers: {
                 "Authorization": `Bearer ${getToken()}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setMessages(data);
            })
            .catch(err => console.error("Failed to load messages", err));
    }, [navigate]);
    const handleStatusUpdate = async (orderId, status) => {
        try {
            await fetch(`http://localhost:5001/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`, 
                },
                body: JSON.stringify({ status })
            });
            setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };
    const handleAddProduct = (e) => {
        e.preventDefault();
        const galleryArray = pGallery ? pGallery.split(',').map(url => url.trim()).filter(url => url) : [];
        if (editingProductId) {
            updateProduct(editingProductId, {
                name: pName,
                nameBs: pName,
                price: parseFloat(pPrice),
                category: pCategory,
                image: pImage,
                description: pDescription,
                gallery: galleryArray
            });
            setEditingProductId(null);
        } else {
            addProduct({
                name: pName,
                nameBs: pName,
                price: parseFloat(pPrice),
                category: pCategory,
                image: pImage,
                description: pDescription,
                gallery: galleryArray
            });
        }
        setPName('');
        setPPrice('');
        setPDescription('');
        setPGallery('');
    };
    const handleReply = async (msgId, replyText) => {
        try {
            const res = await fetch(`http://localhost:5001/api/messages/${msgId}/reply`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json' ,
                    'Authorization': `Bearer ${getToken()}`, 
                },
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
    if (!user || user.role !== 'admin') return null;
    return (
        <div className="py-16 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 text-primary">{t('admin', 'title')}</h1>
                <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
                    <div className="bg-white p-5 rounded-lg shadow-sm h-fit">
                        <button
                            className={`flex items-center gap-3 w-full p-3 rounded mb-2 text-left transition-colors ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            onClick={() => setActiveTab('orders')}
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
                            className={`flex items-center gap-3 w-full p-3 rounded mb-2 text-left transition-colors ${activeTab === 'messages' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            onClick={() => setActiveTab('messages')}
                        >
                            <MessageSquare size={20} /> {t('admin', 'messages')}
                        </button>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
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
                                                        <td className="p-3">{new Date(order.date).toLocaleDateString()}</td>
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
                                    <h3 className="font-bold mb-4">{editingProductId ? 'Edit Product' : t('admin', 'addProduct')}</h3>
                                    <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">{t('admin', 'productName')}</label>
                                            <input className="w-full p-2 border rounded" value={pName} onChange={(e) => setPName(e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">{t('admin', 'productPrice')}</label>
                                            <input type="number" step="0.01" className="w-full p-2 border rounded" value={pPrice} onChange={(e) => setPPrice(e.target.value)} required />
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
                                            <label className="block mb-1 text-sm font-medium">{t('admin', 'productImage')}</label>
                                            <input className="w-full p-2 border rounded" value={pImage} onChange={e => setPImage(e.target.value)} required />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block mb-1 text-sm font-medium">Additional Images (Gallery)</label>
                                            <input
                                                className="w-full p-2 border rounded"
                                                placeholder="Paste image links separated by comma..."
                                                value={pGallery}
                                                onChange={e => setPGallery(e.target.value)}
                                            />
                                            <p className="text-xs text-gray-400 mt-1"></p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block mb-1 text-sm font-medium">Description</label>
                                            <textarea className="w-full p-2 border rounded h-24" value={pDescription} onChange={e => setPDescription(e.target.value)} placeholder="Product details..."></textarea>
                                        </div>
                                        <div className="md:col-span-2 flex gap-2">
                                            <button type="submit" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-secondary">
                                                {editingProductId ? <Edit2 size={18} /> : <Plus size={18} />} {editingProductId ? 'Update' : t('admin', 'save')}
                                            </button>
                                            {editingProductId && (
                                                <button type="button" onClick={() => {
                                                    setEditingProductId(null);
                                                    setPName('');
                                                    setPPrice('');
                                                    setPDescription('');
                                                    setPGallery('');
                                                    setPImage('');
                                                }} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                                <div className="space-y-3">
                                    {products.map(p => (
                                        <div key={p.id} className="flex items-center gap-4 p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                            <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" />
                                            <div className="flex-1">
                                                <div className="font-bold">{p.name}</div>
                                                <div className="text-sm text-gray-500">€{Number(p.price).toFixed(2)} - {p.category}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => {
                                                    setEditingProductId(p.id);
                                                    setPName(p.name);
                                                    setPPrice(p.price);
                                                    setPCategory(p.category);
                                                    setPImage(p.image);
                                                    setPDescription(p.description || '');
                                                    setPGallery((p.gallery || []).join(', '));
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }} className="text-blue-500 hover:bg-blue-50 p-2 rounded">
                                                    <Edit2 size={20} />
                                                </button>
                                                <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                                            <div key={msg.id} className="border border-gray-200 rounded p-4">
                                                <div className="flex justify-between mb-2">
                                                    <strong className="text-primary">{msg.name}</strong>
                                                    <span className="text-sm text-gray-400">{new Date(msg.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="text-sm text-gray-500 mb-3">
                                                    {msg.email}
                                                    {msg.phone && <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">{msg.phone}</span>}
                                                </div>
                                                <p className="bg-gray-50 p-3 rounded text-gray-700 mb-4">{msg.message}</p>
                                                {msg.reply ? (
                                                    <div className="bg-green-50 p-3 rounded border border-green-100 ml-8">
                                                        <strong className="text-green-800 text-xs block mb-1">Reply:</strong>
                                                        <p className="text-green-900">{msg.reply}</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2 mt-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Type a reply..."
                                                            className="flex-1 border p-2 rounded text-sm"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleReply(msg.id, e.target.value);
                                                                    e.target.value = '';
                                                                }
                                                            }}
                                                        />
                                                        <button
                                                            className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-yellow-500"
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
                    </div>
                </div>
            </div>
        </div>
    );
}
