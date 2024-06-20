import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux'
import { GetAllBids, GetProductById, GetProducts } from '../../apicalls/products'
import { SetLoader } from '../../redux/loadersSlice'
import { message,Button} from 'antd';
import  Divider from '../../components/Divider';
import moment from 'moment';
import BidModal from './BidModal';
import { addToCart } from '../../redux/cartSlice';




function ProductInfo() {
  const {user}=useSelector((state)=>state.users);
   const [showAddNewBid,setShowAddNewBid]=React.useState(false);
   const [cart, setCart] = useState([]); // Create a cart state
    const [selectedImageIndex,setSelectedImageIndex]=React.useState(0)
    const [product,setProduct]=React.useState(null)
    const dispatch=useDispatch();
    const navigate=useNavigate()
    const {id}=useParams();

      // Function to add a product to the cart
      const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        navigate("/cart");
      };
    

    const getData = async () => {
        try {
          dispatch(SetLoader(true));
          const response = await GetProductById(id);
          dispatch(SetLoader(false));
          if (response.success) {
            const bidsResponse=await GetAllBids({product:id})
            setProduct({
              ...response.data,
              bids:bidsResponse.data,
            }
            )
          }
        } catch (error) {
          dispatch(SetLoader(false));
          message.error(error.message);
        }
      }
     
      React.useEffect(()=>{
        getData();
      },[])
  return (
    product && <div>
            <div className='grid grid-cols-2 mt-5'>
                {/* images */}
                <div className="flex flex-col gap-5">
                    <img
                    src={product.images[selectedImageIndex]}
                    alt=""
                    className="w-full h-96 object-cover rounded-md"
                    />




                    <div className='flex gap-5'>
                        {product.images.map((image, index) => {
                            return (
                                <img
                                className={
                                    'w-20 h-20 object-cover rounded-md cursor-pointer' +
                                    (selectedImageIndex === index ? "border-2 border-green-700 border-solid p-2"
                                    : "")
                                }
                                onClick={() => setSelectedImageIndex(index)}
                                src={image}
                                alt=""
                                />
                            )
                        })}
                    </div>
                    <Divider />




                    <div className='text-gray-600'>
                        <h1>
                            Added On
                        </h1>
                        <span>
                            {moment(product.createdAt).format("MMM D, YYYY")}
                        </span>
                    </div>




                </div>

               

                {/* details */}
                <div className='flex flex-col gap-5 p-5'>
                    <div>
                    <h1 className='text-2xl font-semibold text-lime-6 text-orange-900'>
                        {product.name}
                        </h1>
                    <span>
                        {product.description}
                    </span>
                    </div>




                    <Divider />
                    <div className='flex flex-col'>
                        <h1 className='text-2xl font-semibold text-lime-6 text-orange-900 '>
                            Product Details
                            </h1>
                            <div className='flex justify-between mt-2'>
                                <span>Price</span>
                                <span>₹ {product.price}</span>
                            </div>
                            <div className='flex justify-between mt-2'>
                                <span>Location</span>
                                <span>{product.location}</span>
                            </div>

                            <div className='flex justify-between mt-2'>
                                <span>Category</span>
                                <span className='uppercase'> {product.category}</span>
                            </div>
                            <div className='flex justify-between mt-2'>
                                <span>Bill Available</span>
                                <span> {product.billAvailable ? "Yes" : "No"}</span>
                            </div>
                            <div className='flex justify-between mt-2'>
                                <span>Box Available</span>
                                <span> {product.boxAvailable ? "Yes" : "No"}</span>
                            </div>
                            <div className='flex justify-between mt-2'>
                                <span>Warranty Available</span>
                                <span> {product.warrantyAvailable ? "Yes" : "No"}</span>
                            </div>
                            <div className='flex justify-between mt-2'>
                                <span>Accessories Available</span>
                                <span> {product.accessoriesAvailable ? "Yes" : "No"}</span>
                            </div>
                            <div className='flex justify-between mt-2'>
                                <span>Purchased Year</span>
                                <span>
                                    {moment().subtract(product.age, 'years').format("YYYY")} ({product.age} years ago)
                                </span>
                            </div>
                    </div>
                            <Button
                                        type="primary"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        Add to Cart
                                    </Button>




                    <Divider />
                    <div className='flex flex-col'>
                        <h1 className='text-2xl font-semibold text-lime-6 text-orange-900'>
                            Seller Details
                            </h1>
                            {product && product.seller && (
                            <div className='flex justify-between mt-2'>
                                <span>Name</span>
                                <span>{product.seller.name}</span>
                            </div>
                            )}
                            {product && product.seller && (
                            <div className='flex justify-between mt-2'>
                                <span>Email</span>
                                <span>{product.seller.email} </span>
                            </div>
                            )}
                    </div>




                    <Divider />
                    <div className="flex flex-col">
                        <div className='flex justify-between mb-5'>
                        <h1 className="text-2xl font-semibold text-orange-900">
                            Bids
                        </h1>
                        <Button onClick={() => setShowAddNewBid(!showAddNewBid)}
                        disabled={user?._id === product.seller?._id}>
                        New Bid
                        </Button>
                        </div>
                        {
                            product.showBidsOnProductPage &&
                        product?.bids?.map((bid) =>{
                            return(
                                <div className='border border-gray-300 border-solid p-3 rounded mt-5'>
                                <div className='flex justify-between  text-gray-700'>
                                <span>Name</span>
                                <span>{bid.buyer?.name || 'N/A'}</span>
                                </div>
                               
                                <div className='flex justify-between  text-gray-700'>
                                <span>Bid Amount</span>
                                <span>₹ {bid.bidAmount}</span>
                                </div>
                                <div className='flex justify-between  text-gray-700'>
                                <span>Bid Place On</span>
                                <span>{" "}{moment(product.createdAt).format("DD-MM-YYYY hh:mm a ")}</span>
                                </div>
                                </div>
                            );
                        })}
                       
                    </div>
                </div>
                </div>
                {showAddNewBid && <BidModal
                  product={product}
                  reloadData={getData}
                  showBidsModal={showAddNewBid}
                  setShowBidsModal={setShowAddNewBid}
                />}




         
        </div>
    )
}




export default ProductInfo;
