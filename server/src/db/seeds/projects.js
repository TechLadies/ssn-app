import {
  Project,
  IssueAddressed,
  ProjectState,
  ProjectType,
  ProjectLocation,
  ProjectFrequency,
  VolunteerRequirementType,
} from 'models/Project';

import {
  seedData,
  getProjectOwner,
  connectMongoose,
  closeMongooseConnection,
} from './utils';

connectMongoose();

getProjectOwner()
  .then(async (projectOwner) => {
    if (!projectOwner) {
      console.log('Please seed Project Owners first');
      return;
    }
    const volunteerRequirementAttributes = [
      {
        type: [VolunteerRequirementType.INTERACTION],
        commitmentLevel: 'Once a Week',
        number: 5,
      },
    ];

    const projectAttributes = [
      {
        title: 'Save the Earth',
        coverImageUrl:
          'https://s3-ap-southeast-1.amazonaws.com/ssn-app-maryana/Terra-recycling.jpg',
        description:
          'Cat ipsum dolor sit amet, malkin yet donskoy for havana brown or balinese . American shorthair. Balinese bobcat or himalayan yet bombay. Lion panther thai. Persian british shorthair so himalayan and panther and norwegian forest and bengal. Bobcat maine coon bobcat, yet birman. Scottish fold bombay himalayan lion bombay abyssinian . Russian blue. Donskoy maine coon. Siamese lynx. Cougar tiger devonshire rex. Egyptian mau. Grimalkin persian. Burmese thai himalayan bobcat. Cornish',
        volunteerSignupUrl: '',
        volunteerRequirements: volunteerRequirementAttributes,
        projectOwner: projectOwner.id,
        issuesAddressed: [
          IssueAddressed.LAND_AND_NOISE_POLLUTION,
          IssueAddressed.WASTE,
        ],
        volunteerRequirementsDescription:
          'Kitten tiger malkin egyptian mau. Lynx tomcat for ragdoll. Tomcat ocelot and tabby. Savannah grimalkin and jaguar yet siberian. Malkin american shorthair turkish angora manx. Cornish rex cornish rex and norwegian forest.',
        volunteerBenefitsDescription:
          'Turkish angora siamese. Puma. Scottish fold. Bobcat ocicat. Kitty bombay.',
        projectType: ProjectType.EVENT,
        time: '9 AM',
        location: ProjectLocation.CENTRAL,
        state: ProjectState.APPROVED_INACTIVE,
        startDate: new Date(2018, 12, 1),
        endDate: new Date(2018, 12, 2),
        frequency: ProjectFrequency.ONCE_A_WEEK,
      },
      {
        title: 'Cat Adoption Drive',
        coverImageUrl:
          'https://s3-ap-southeast-1.amazonaws.com/ssn-app-maryana/Singapore-Cat-Festival-2018.jpg',
        description: 'Save the earth description',
        volunteerSignupUrl: '',
        volunteerRequirements: volunteerRequirementAttributes,
        projectOwner: projectOwner.id,
        issuesAddressed: [IssueAddressed.AIR_QUALITY],
        volunteerRequirementsDescription: 'requirementDescription2',
        volunteerBenefitsDescription: 'lunch',
        projectType: ProjectType.EVENT,
        time: '10 AM',
        location: ProjectLocation.WEST,
        state: ProjectState.PENDING_APPROVAL,
        startDate: new Date(2018, 10, 1),
        endDate: new Date(2018, 10, 1),
        frequency: ProjectFrequency.ONCE_A_WEEK,
      },
      {
        title: 'Greenland Project',
        coverImageUrl:
          'https://s3-ap-southeast-1.amazonaws.com/ssn-app-maryana/greenland.png',
        description: 'Greenland Project description',
        volunteerSignupUrl: '',
        volunteerRequirements: volunteerRequirementAttributes,
        projectOwner: projectOwner.id,
        issuesAddressed: [IssueAddressed.WASTE, IssueAddressed.GREEN_LIFESTYLE],
        volunteerRequirementsDescription: 'requirementDescription1',
        volunteerBenefitsDescription: 'certificate',
        projectType: ProjectType.RECURRING,
        time: '9 AM',
        location: ProjectLocation.WEST,
        state: ProjectState.REJECTED,
        startDate: new Date(),
        endDate: new Date(),
        frequency: ProjectFrequency.A_FEW_TIMES_A_YEAR,
        rejectionReason: 'Lorem ipsum dolor sit amet, id commodo invidunt persecuti nam, id alienum deserunt urbanitas eam, denique elaboraret definitiones eum at. Mea cu maluisset deseruisse, phaedrum honestatis ius ex. Sed id novum melius consulatu. No cum menandri adipiscing, ei vocent persius mei. Ex vis mutat fastidii.',
      },
      {
        title: 'Default Image Project',
        description: 'Default Image Project description',
        volunteerSignupUrl: '',
        volunteerRequirements: volunteerRequirementAttributes,
        projectOwner: projectOwner.id,
        issuesAddressed: [IssueAddressed.WASTE, IssueAddressed.GREEN_LIFESTYLE],
        volunteerRequirementsDescription: 'requirementDescription1',
        volunteerBenefitsDescription: 'certificate',
        projectType: ProjectType.RECURRING,
        time: '9 AM',
        location: ProjectLocation.WEST,
        state: ProjectState.PENDING_APPROVAL,
        frequency: ProjectFrequency.A_FEW_TIMES_A_YEAR,
      },
      {
        title: 'Default Image Project',
        description: 'Default Image Project description',
        volunteerSignupUrl: '',
        volunteerRequirements: volunteerRequirementAttributes,
        projectOwner: projectOwner.id,
        issuesAddressed: [IssueAddressed.WASTE, IssueAddressed.GREEN_LIFESTYLE],
        volunteerRequirementsDescription: 'requirementDescription1',
        volunteerBenefitsDescription: 'certificate',
        projectType: ProjectType.RECURRING,
        time: '9 AM',
        location: ProjectLocation.WEST,
        state: ProjectState.PENDING_APPROVAL,
        startDate: new Date(),
        endDate: new Date(),
        frequency: ProjectFrequency.A_FEW_TIMES_A_YEAR,
      },
      {
        title: 'Default Image Project',
        description: 'Default Image Project description',
        volunteerSignupUrl: '',
        volunteerRequirements: volunteerRequirementAttributes,
        projectOwner: projectOwner.id,
        issuesAddressed: [IssueAddressed.WASTE, IssueAddressed.GREEN_LIFESTYLE],
        volunteerRequirementsDescription: 'requirementDescription1',
        volunteerBenefitsDescription: 'certificate',
        projectType: ProjectType.RECURRING,
        time: '9 AM',
        location: ProjectLocation.WEST,
        state: ProjectState.PENDING_APPROVAL,
        startDate: new Date(),
        endDate: new Date(),
        frequency: ProjectFrequency.A_FEW_TIMES_A_YEAR,
      },
      {
        title: 'Default Image Project',
        description: 'Default Image Project description',
        volunteerSignupUrl: '',
        volunteerRequirements: volunteerRequirementAttributes,
        projectOwner: projectOwner.id,
        issuesAddressed: [IssueAddressed.WASTE, IssueAddressed.GREEN_LIFESTYLE],
        volunteerRequirementsDescription: 'requirementDescription1',
        volunteerBenefitsDescription: 'certificate',
        projectType: ProjectType.RECURRING,
        time: '9 AM',
        location: ProjectLocation.WEST,
        state: ProjectState.APPROVED_ACTIVE,
        startDate: new Date(),
        endDate: new Date(),
        frequency: ProjectFrequency.A_FEW_TIMES_A_YEAR,
      },
      {
        title: 'Default Image Project',
        description: 'Default Image Project description',
        volunteerSignupUrl: '',
        volunteerRequirements: volunteerRequirementAttributes,
        projectOwner: projectOwner.id,
        issuesAddressed: [IssueAddressed.WASTE, IssueAddressed.GREEN_LIFESTYLE],
        volunteerRequirementsDescription: 'requirementDescription1',
        volunteerBenefitsDescription: 'certificate',
        projectType: ProjectType.RECURRING,
        time: '9 AM',
        location: ProjectLocation.WEST,
        state: ProjectState.APPROVED_ACTIVE,
        startDate: new Date(),
        endDate: new Date(),
        frequency: ProjectFrequency.A_FEW_TIMES_A_YEAR,
      },
      {
        title: 'Default Image Project',
        description: 'Default Image Project description',
        volunteerSignupUrl: '',
        volunteerRequirements: volunteerRequirementAttributes,
        projectOwner: projectOwner.id,
        issuesAddressed: [IssueAddressed.WASTE, IssueAddressed.GREEN_LIFESTYLE],
        volunteerRequirementsDescription: 'requirementDescription1',
        volunteerBenefitsDescription: 'certificate',
        projectType: ProjectType.RECURRING,
        time: '9 AM',
        location: ProjectLocation.WEST,
        state: ProjectState.APPROVED_ACTIVE,
        startDate: new Date(),
        endDate: new Date(),
        frequency: ProjectFrequency.A_FEW_TIMES_A_YEAR,
      },
      {
        title: 'Some inactive project',
        description: 'Random text here',
        volunteerSignupUrl: '',
        volunteerRequirements: volunteerRequirementAttributes,
        projectOwner: projectOwner.id,
        issuesAddressed: [IssueAddressed.OTHER, IssueAddressed.BIODIVERSITY],
        volunteerRequirementsDescription: 'you need to be very hardworking',
        volunteerBenefitsDescription: 'work all day long',
        projectType: ProjectType.RECURRING,
        time: '9 AM',
        location: ProjectLocation.WEST,
        state: ProjectState.APPROVED_INACTIVE,
        startDate: new Date(),
        endDate: new Date(),
        frequency: ProjectFrequency.A_FEW_TIMES_A_YEAR,
      },
    ];

    await seedData(projectAttributes, Project, 'project');
  })
  .catch((err) => {
    console.log(`error: ${err}`);
  })
  .finally(() => {
    closeMongooseConnection();
  });
