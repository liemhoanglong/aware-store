import React, { useState, useEffect } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import QueryString from 'query-string';

import SideBar from '../components/SideBar';
import ProductCard from '../components/ProductCard';
import arrowDown from '../images/arrow-down.svg';
import CallAPI from '../services/CallAPI';

export default function ProductList(props) {
    // console.log('product page');
    const location = useLocation();
    const history = useHistory();
    const [brandData, setBrandData] = useState([]);
    const [categroup, setCategroup] = useState('');
    const [load, setLoad] = useState(true);
    const [filter, setFilter] = useState({
        page: 1,
        name: '',
        brand: '',
        catelist: '',
        categroup: '',
        cate: '',
        color: '',
        size: '',
        minprice: 0,
        maxprice: 10000,
        status: '',
        sort: ''
    });
    const [productData, setProductData] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                let callBrand = CallAPI('/brand', 'get', null);
                let res = await callBrand;
                setBrandData(res.data.data);
            } catch (err) {
                console.log(err)
            }
            setLoad(false);
        };
        fetchAll();
    }, [])

    //when location change set the filter and callApi
    useEffect(() => {
        // setLoad(true);
        const fetchData = async () => {
            let queryObject = QueryString.parse(location.search);
            // console.log(queryObject)
            queryObject.page = queryObject.page === undefined ? 1 : queryObject.page;
            queryObject.name = queryObject.name === undefined ? '' : queryObject.name;
            queryObject.brand = queryObject.brand === undefined ? '' : queryObject.brand;
            queryObject.catelist = queryObject.catelist === undefined ? '' : queryObject.catelist;
            queryObject.categroup = queryObject.categroup === undefined ? '' : queryObject.categroup;
            queryObject.cate = queryObject.cate === undefined ? '' : queryObject.cate;
            queryObject.color = queryObject.color === undefined ? '' : queryObject.color;
            queryObject.size = queryObject.size === undefined ? '' : queryObject.size;
            queryObject.minprice = queryObject.minprice === undefined ? 0 : queryObject.minprice;
            queryObject.maxprice = queryObject.maxprice === undefined ? 10000 : queryObject.maxprice;
            queryObject.status = queryObject.status === undefined ? '' : queryObject.status;
            queryObject.sort = queryObject.sort === undefined ? '' : queryObject.sort;
            setFilter(prevState => ({
                ...prevState,
                page: queryObject.page,
                name: queryObject.name,
                brand: queryObject.brand,
                catelist: queryObject.catelist,
                categroup: queryObject.categroup,
                cate: queryObject.cate,
                color: queryObject.color,
                size: queryObject.size,
                minprice: queryObject.minprice,
                maxprice: queryObject.maxprice,
                status: queryObject.status,
                sort: queryObject.sort
            }));
            try {
                let resProduct = CallAPI(`/product/search?name=${queryObject.name}&brand=${queryObject.brand}&catelist=${queryObject.catelist}&categroup=${queryObject.categroup}&cate=${queryObject.cate}&color=${queryObject.color}&size=${queryObject.size}&minprice=${queryObject.minprice}&maxprice=${queryObject.maxprice}&status=${queryObject.status}&sort=${queryObject.sort}&page=${queryObject.page}`, 'GET', null);
                // console.log(res.data)
                let resCategroup = '';
                if (queryObject.categroup != '') {
                    resCategroup = CallAPI(`/cate-group/${queryObject.categroup}`, 'get', null)
                }
                let resProductData = await resProduct;
                let resCategroupData = await resCategroup;
                setProductData(resProductData.data.data);
                setCategroup(resCategroupData.data.data.name);
            } catch (err) {
                console.log(err)
            }
            setLoad(false);
        }
        fetchData();
    }, [location])

    const handleChangeFilter = (value) => {
        let queryObject = QueryString.parse(history.location.search);
        // console.log('query ' + '-----------' + value.brand);
        value.size != undefined && (queryObject.size = value.size);
        value.color != undefined && (queryObject.color = value.color);
        value.brand != undefined && (queryObject.brand = value.brand);
        value.minprice != undefined && (queryObject.minprice = value.minprice);
        value.maxprice != undefined && (queryObject.maxprice = value.maxprice);
        value.status != undefined && (queryObject.status = value.status);
        value.page != undefined && (queryObject.page = value.page);
        value.sort != undefined && (queryObject.sort = value.sort);
        value.cate != undefined && (queryObject.cate = value.cate);
        const keys = Object.keys(queryObject);
        let queryString = '';
        for (let i = 0; i < keys.length; i++) {
            if (queryObject[keys[i]])
                if (queryString === '') {
                    queryString += `?${keys[i]}=${queryObject[keys[i]]}`;
                }
                else {
                    queryString += `&${keys[i]}=${queryObject[keys[i]]}`;
                }
        }
        history.push({ search: queryString });
    }

    const handleChangePage = (page) => {
        // console.log('onclick ' + page)
        if (page < 1) page = 1;
        if (page > Math.ceil(productData.count / 20)) page = Math.ceil(productData.count / 20);
        setFilter(prevState => ({
            ...prevState,
            page
        }))
        handleChangeFilter({ page })
    }

    const handleClickPrePage = () => {
        let page = filter.page;
        // console.log('onclick Pre Page ' + page)
        if (page - 1 < 1) return;
        --page;
        setFilter(prevState => ({
            ...prevState,
            page
        }))
        handleChangePage(page)
    }

    const handleClickNextPage = () => {
        let page = filter.page;
        // console.log('onclick Next Page ' + page)
        if (page + 1 > productData.count) return;
        ++page
        setFilter(prevState => ({
            ...prevState,
            page
        }))
        handleChangePage(page)
    }

    const handleClickSort = (sort) => {
        // console.log('onclick ' + sort)
        handleChangeFilter({ sort })
    }

    return (
        <Container>
            {/* <Progress isLoad={load} /> */}
            <Row>
                <center>
                    <h1 className='my-4 text-14' >
                        {filter.catelist === '6136342577e31326701a18fd' ? 'Men' : filter.catelist === '6136343677e31326701a1901' ? 'Ladies' : filter.catelist === '6136343b77e31326701a1903' ? 'Girls' : filter.catelist === '' ? '' : 'Boys'}
                        {categroup != '' ? ' / ' + categroup : ''}
                    </h1>
                </center>
                <Col lg={2}>
                    <SideBar
                        brandData={brandData}
                        setFilter={setFilter}
                        filter={filter}
                        categroup={categroup}
                        handleChangeFilter={handleChangeFilter}
                    />
                </Col>
                <Col lg={10}>
                    <div className='d-flex flex-wrap justify-content-between'>
                        <div className="custom-dropdown ms-4">
                            <button className="dropbtn">
                                Sort By: &nbsp; <b>{filter.sort === '1' ? 'Name: A - Z' : filter.sort === '2' ? 'Price: lowest to highest' : filter.sort === '3' ? 'Price: highest to lowest' : 'Popularity'}</b>
                                <img src={arrowDown} className='dropbtn-arrow-down ms-3' />
                            </button>
                            <div className="dropdown-content">
                                <div onClick={() => handleClickSort('0')} className="dropdown-item">Popularity</div>
                                <div onClick={() => handleClickSort('1')} className="dropdown-item">Name: A - Z</div>
                                <div onClick={() => handleClickSort('2')} className="dropdown-item">Price: lowest to highest</div>
                                <div onClick={() => handleClickSort('3')} className="dropdown-item">Price: highest to lowest</div>
                            </div>
                        </div>
                        {(productData && productData.count) ?
                            <div className='d-flex align-self-center'>
                                <img onClick={handleClickPrePage} className='rotate-left cursor-hover' src={arrowDown} alt='arrow-left' />
                                <input name='page' value={filter.page} onChange={(e) => handleChangePage(e.target.value)} style={{ border: 'none', width: '30px', textAlign: 'right', marginTop: '-1px' }} />/{productData && productData.count ? Math.ceil(productData.count / 20) : '1'}
                                <img onClick={handleClickNextPage} className='rotate-right cursor-hover ms-3' src={arrowDown} alt='arrow-right' />
                            </div>
                            : null
                        }
                    </div>
                    <div className='d-flex flex-wrap'>
                        {productData && productData.products.map((product) => (
                            <ProductCard key={product._id} product={product}></ProductCard>
                        ))}
                    </div>
                    <div className='d-flex flex-wrap justify-content-between'>
                        <div>
                        </div>
                        {(productData && productData.count) ?
                            <div className='d-flex align-self-center'>
                                <img onClick={handleClickPrePage} className='rotate-left cursor-hover' src={arrowDown} alt='arrow-left' />
                                <input name='page' value={filter.page} onChange={(e) => handleChangePage(e.target.value)} style={{ border: 'none', width: '30px', textAlign: 'right', marginTop: '-1px' }} />/{productData && productData.count ? Math.ceil(productData.count / 20) : '1'}
                                <img onClick={handleClickNextPage} className='rotate-right cursor-hover ms-3' src={arrowDown} alt='arrow-right' />
                            </div>
                            : null
                        }
                    </div>
                </Col>
            </Row>
        </Container>
    )
}