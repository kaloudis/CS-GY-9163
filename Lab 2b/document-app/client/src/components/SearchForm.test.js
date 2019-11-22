import React from 'react';
import SearchForm from './SearchForm';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('SearchForm', () => {
    xit('should handle searches', () => {
        const spy = jest.fn();

        const wrapper = shallow(<SearchForm searchDocuments={() => spy()} />);
        wrapper.find('input').simulate('keydown', { keyCode: 13 });
        expect(spy).toBeCalled();
    });

    it('on component mount we set the keydown listener', () => {
        window.addEventListener = jest.fn();
        shallow(<SearchForm searchDocuments={() => console.log('searchDocuments')} />);
        expect(window.addEventListener).toHaveBeenCalled();
    });

    it('on component unmount we remove the keydown listener', () => {
        window.removeEventListener = jest.fn();
        const wrapper = shallow(<SearchForm searchDocuments={() => console.log('a')} />);
        wrapper.unmount();
        expect(window.removeEventListener).toHaveBeenCalled();
    });
});