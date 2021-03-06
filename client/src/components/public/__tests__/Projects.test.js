import React from 'react';
import { Tabs, Tab } from '@material-ui/core';

import { _testExports } from '../Projects';
import { defaultAppContext } from 'components/main/AppContext';
import { ProjectState } from 'components/shared/enums/ProjectState';
import { AlertType } from 'components/shared/Alert';
import { Spinner } from 'components/shared/Spinner';
import { PublicProjectListing } from 'components/shared/PublicProjectListing';
import { SearchBar } from 'components/shared/SearchBar';
import { mockSuccessfulResponse, mockErrorResponse } from 'util/testHelper';

const Projects = _testExports.Projects;

xdescribe('Projects', () => {
  let component;
  let counts;
  let mockContext;

  beforeEach(() => {
    counts = {
      [ProjectState.PENDING_APPROVAL]: 1,
      [ProjectState.APPROVED_ACTIVE]: 0,
      [ProjectState.APPROVED_INACTIVE]: 2,
      [ProjectState.REJECTED]: 3,
    };
    const mockResponse = mockSuccessfulResponse({ counts });
    mockContext = { ...defaultAppContext };
    mockContext.utils.requestWithAlert = {
      get: jest.fn(() => Promise.resolve(mockResponse)),
    };
    mockContext.updaters.showAlert = jest.fn();

    component = shallow(<Projects classes={{}} context={mockContext} />, {
      disableLifecycleMethods: true,
    });
  });

  describe('when component mounts', () => {
    it('should fetch project counts and set loading state', async () => {
      expect(component.state().isLoading).toBeTruthy();
      expect(component.state().counts).toEqual({});

      await component.instance().componentDidMount();

      expect(component.state().isLoading).toBeFalsy();
      expect(component.state().counts).toEqual(counts);
    });

    describe('when there is an error fetching project counts', () => {
      const errorsObject = {
        errors: [{ title: 'some error', detail: 'some error' }],
      };

      beforeEach(() => {
        const mockResponse = mockErrorResponse(errorsObject);
        mockContext = { ...defaultAppContext };
        mockContext.utils.requestWithAlert = {
          get: jest.fn(() => Promise.resolve(mockResponse)),
        };
        mockContext.updaters.showAlert = jest.fn();

        component = shallow(<Projects classes={{}} context={mockContext} />, {
          disableLifecycleMethods: true,
        });
      });

      it('should show an error alert', async () => {
        await component.instance().componentDidMount();

        expect(mockContext.updaters.showAlert).toHaveBeenCalledWith(
          'getProjectCountsFailure',
          AlertType.ERROR,
          expect.any(String)
        );
      });

      it('should render tab labels without counts in brackets', async () => {
        await component.instance().componentDidMount();

        const activeTab = component.find(Tab).get(0);
        expect(activeTab.props.label).toEqual('Active');
        const inactiveTab = component.find(Tab).get(1);
        expect(inactiveTab.props.label).toEqual('Inactive');
      });
    });
  });

  describe('render', () => {
    it('should render the search bar', () => {
      expect(component.find(SearchBar)).toBeTruthy();
    });

    describe('when loading', () => {
      it('should render a spinner instead of tabs', () => {
        component.setState({ isLoading: true });
        component.update();

        expect(component.find(Spinner).exists()).toBeTruthy();
        expect(component.find(Tabs).exists()).toBeFalsy();
      });
    });

    describe('when no longer loading', () => {
      beforeEach(async done => {
        await component.instance().componentDidMount();
        done();
      });

      it('should render all tab labels', () => {
        const activeTab = component.find(Tab).get(0);
        expect(activeTab.props.label).toEqual(
          `Active (${counts[ProjectState.APPROVED_ACTIVE]})`
        );
        const inactiveTab = component.find(Tab).get(1);
        expect(inactiveTab.props.label).toEqual(
          `Inactive (${counts[ProjectState.APPROVED_INACTIVE]})`
        );
      });

      describe('when active tab selected', () => {
        it('should render project listing with active project state', () => {
          component.setState({ tabValue: 0 });
          component.update();

          expect(component.find(PublicProjectListing).props().projectState).toEqual(
            ProjectState.APPROVED_ACTIVE
          );
        });
      });

      describe('when inactive tab selected', () => {
        it('should render project listing with inactive project state', () => {
          component.setState({ tabValue: 1 });
          component.update();

          expect(component.find(PublicProjectListing).props().projectState).toEqual(
            ProjectState.APPROVED_INACTIVE
          );
        });
      });
    });
  });
});
