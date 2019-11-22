import React from 'react';
import FileUpload from './FileUpload';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as axios from 'axios';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('axios');

describe('FileUpload', () => {
    it('should handle successful submissions', async() => {
        const p = Promise.resolve('success');
        const spy = jest.fn(() => p);
        const fakeEvent = { preventDefault: () => console.log('preventDefault') };
        axios.post.mockImplementation(() => p);

        const wrapper = shallow(<FileUpload responseHandler={() => spy()} errorHandler={() => console.log('error')} />);
        wrapper.find('form').simulate('submit', fakeEvent);
        await p;
        expect(spy).toBeCalled();
    });

    it('should handle errors', async() => {
        const p = Promise.reject('someErrorData');
        const spy = jest.fn(() => p());
        const fakeEvent = { preventDefault: () => console.log('preventDefault') };
        axios.post.mockImplementation(() => p);

        const wrapper = shallow(<FileUpload responseHandler={() => console.log('success')} errorHandler={() => spy('error')} />);
        wrapper.find('form').simulate('submit', fakeEvent);
        try {
            await p;
        } catch(err) {
            expect(err).toEqual("someErrorData");
        }
    });
});