import React, { useContext, useState, useReducer } from 'react';
import { Drawer } from 'antd';
import UnitsDataConfig from './UnitsConfig.js';
import { AppContext } from '../App';
import unitReducer from './unitReducer.js';
import { ReactComponent as PCSVG} from '../assets/PC.svg';
import { ReactComponent as PS4} from '../assets/console-with-gamepad.svg';
import { ReactComponent as PS5} from '../assets/playstation-5.svg';
import DContent from './DrawerContent.jsx';
import { useEffect } from 'react';



export default function Unit({index, unitType}) {

    // let pricesList = Units_DB.unitsPrices[unitType]
    let { appSettings } = useContext(AppContext)

    const initialValues = {
        unitType,
        status: 0,// 0 = Not start yet, 1 = paused, 2 = Running...
        hourPrice: unitType === 'pc' ? appSettings.pc.hourPrice : appSettings[unitType].singlePrice,
        duration: 0,
        durationWork: false,
        startTime: '00:00',
        mode: unitType === 'pc' ? 'pc' : 'single',// [single & Multi] for PS; [pc] for pc 
        orders: [
            {name: 'Can', price: 10, count: 3},
            {name: 'Indomy', price: 7, count: 2}
        ]
    }
    
    const [open, setOpen] = useState(false);
    const { unitIndexStyle } = UnitsDataConfig[unitType];
    const { appSettings: {theme : { colors, isDark }} } = useContext(AppContext)
    let [unitState, dispatch] = useReducer(unitReducer, initialValues)
    const unitImgStyle = {
        fill: colors.textWithOpacity(isDark ? 75 : 90),
        filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, .8))',
        width: '100%',
        height: 115,
        position: 'relative',
        padding: unitType === 'ps4' ? '6px 6px 0' : ''
    }

    function getDuration() {
        let totalSeconds = unitState.duration;
        let hours = Math.floor( totalSeconds / (60 * 60) )
        let minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
        return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    }

    useEffect(() => {
        let durationInterval;
        if (unitState.durationWork) {

            durationInterval = setInterval(() => {
                dispatch({type: 'INCREMENT_TIME'})
            }, 1000)
        }

        return () => clearInterval(durationInterval)

    }, [unitState.durationWork])


    return (
    <>
        <div className='item' style={{position: 'relative'}} onClick={() => setOpen(true)}>
            <div style={{ 
                cursor: 'pointer',
                zIndex: 2,
                position: 'absolute',
                inset: 0
                }}></div>{/* This Div Is Overlay for prevent select images & text */}
            <span style={unitIndexStyle}>{index < 9 ? `0${index + 1}` : index + 1}</span>
            {
                unitType === 'pc' ? <PCSVG style={unitImgStyle} />
                : unitType === 'ps4' ? <PS4 style={unitImgStyle} />
                : unitType === 'ps5' ? <PS5 style={unitImgStyle} /> : null
                
            }
            <div style={{
                color:  unitState.status === 0 ? '#ff6666' :
                        unitState.status === 1 ? 'yellow' :
                        unitState.status === 2 ? '#40e2a0' : '#DDD', 

                fontSize: 16, display: 'block', textAlign: 'center'
                }}>{getDuration()}</div>
        </div>
        <Drawer
            className={isDark && 'dark-drawer'}
            title={`${unitType.toUpperCase()} Drawer ${index < 9 ? `0${index + 1}` : index + 1}`}
            placement='right'
            closable={false}
            onClose={() => setOpen(false)}
            open={open}
            key={`${unitType}-${index}`}
        >
            <DContent unitState={unitState} unitType={unitType} dispatch={dispatch} />
        </Drawer>
    </>
    )
}