import type { NextPage } from 'next';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import Sider from 'antd/lib/layout/Sider';
import { Content } from 'antd/lib/layout/layout';
import LiquidateSidebar from "../../components/LiquidateSidebar/LiquidateSidebar";

const Liquidate: NextPage = () => {
    return (
        <LayoutRedesign>
            <Content>
                Content
            </Content>
            <Sider width={350}>
                <LiquidateSidebar />
            </Sider>
        </LayoutRedesign>
    );
};

export default Liquidate;
