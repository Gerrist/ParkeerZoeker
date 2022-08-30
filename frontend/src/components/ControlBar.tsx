import styled from 'styled-components';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

export type ControlBarItem = {
    id: string;
    target: string;
    icon: IconProp;
    active: boolean;
};

type ItemProps = {
    active: boolean;
};

const Container = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding: 16px;
  
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  
  z-index: 1000;
`;

const Item = styled.div`
  border-radius: 1024px;
  background-image: ${(p: ItemProps) => p.active ? 'var(--gradient-blue)' : 'none'};
  border: ${(p: ItemProps) => p.active ? 'none' : '#C9C9C9 1px solid'};
  color: ${(p: ItemProps) => p.active ? '#ffffff' : '#3f3f3f'};
  height: 60px;
  width: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
`;

const ControlBar = ({items}: {
    items: ControlBarItem[];
}) => {
    return (
        <Container>
            {
                items.map(item => {
                    return (
                        <Item key={item.id} active={item.active}>
                            <FontAwesomeIcon icon={item.icon} />
                        </Item>
                    );
                })
            }
        </Container>
    );
};

export default ControlBar;