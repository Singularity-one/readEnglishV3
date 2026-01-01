import { createRouter, createWebHistory } from 'vue-router';
import DayEn15 from '../views/DayEn15.vue';
import dayOne from '../views/dayOne.vue';
import excelUpdata from '../views/excelUpdata.vue';
import excelView from '../views/excelView.vue';
import ListTry50 from '../views/ListTry50.vue';

// 保留前兩篇作為舊版本參考
import ClimateChangeAndItsImpact from '../views/ClimateChangeAndItsImpact.vue';
import PollutionInModernCities from '../views/PollutionInModernCities.vue';

// 新的統一文章頁面
import ArticlePage from '../views/ArticlePage.vue';

const routes = [
  // 非文章頁面
  { path: '/DayEn15', name: 'DayEn15', component: DayEn15 },
  { path: '/dayOne', name: 'dayOne', component: dayOne },
  { path: '/excelUpdata', name: 'ExcelUpdata', component: excelUpdata },
  { path: '/excelView', name: 'ExcelView', component: excelView },
  { path: '/ListTry50', name: '50list', component: ListTry50 },
  
  // 文章頁面 - 前兩篇保留舊版本(可選)
  { path: '/ClimateChangeAndItsImpact', name: 'ClimateChangeAndItsImpact', component: ClimateChangeAndItsImpact },
  { path: '/PollutionInModernCities', name: 'PollutionInModernCities', component: PollutionInModernCities },
  
  // 其餘 50 篇都使用新的 ArticlePage
  { path: '/RenewableEnergyVsFossilFuels', name: 'RenewableEnergyVsFossilFuels', component: ArticlePage },
  { path: '/TheImportanceOfForests', name: 'TheImportanceOfForests', component: ArticlePage },
  { path: '/WaterConservation', name: 'WaterConservation', component: ArticlePage },
  { path: '/BenefitsOfExercise', name: 'BenefitsOfExercise', component: ArticlePage },
  { path: '/TheRoleOfDoctorsInSociety', name: 'TheRoleOfDoctorsInSociety', component: ArticlePage },
  { path: '/HealthyeatingHabits', name: 'HealthyeatingHabits', component: ArticlePage },
  { path: '/MentalHealthAwareness', name: 'MentalHealthAwareness', component: ArticlePage },
  { path: '/TheImpactOfModernMedicine', name: 'TheImpactOfModernMedicine', component: ArticlePage },
  { path: '/ArtificialIntelligenceInDailyLife', name: 'ArtificialIntelligenceInDailyLife', component: ArticlePage },
  { path: '/TheRoleOfTheInternetInEducation', name: 'TheRoleOfTheInternetInEducation', component: ArticlePage },
  { path: '/SpaceExplorationIsItWorthIt', name: 'SpaceExplorationIsItWorthIt', component: ArticlePage },
  { path: '/TheDangersOfSocialMedia', name: 'TheDangersOfSocialMedia', component: ArticlePage },
  { path: '/TheFutureOfTransportation', name: 'TheFutureOfTransportation', component: ArticlePage },
  { path: '/TheValueOfUniversityEducation', name: 'TheValueOfUniversityEducation', component: ArticlePage },
  { path: '/OnlineLearningVsTraditionalSchools', name: 'OnlineLearningVsTraditionalSchools', component: ArticlePage },
  { path: '/TheImportanceOfLearningForeignLanguages', name: 'TheImportanceOfLearningForeignLanguages', component: ArticlePage },
  { path: '/ShouldStudentsWearUniforms', name: 'ShouldStudentsWearUniforms', component: ArticlePage },
  { path: '/HowExamsHelpStudents', name: 'HowExamsHelpStudents', component: ArticlePage },
  { path: '/TheBenefitsOfRemoteWork', name: 'TheBenefitsOfRemoteWork', component: ArticlePage },
  { path: '/StartingABusinessVsHavingAJob', name: 'StartingABusinessVsHavingAJob', component: ArticlePage },
  { path: '/TheImportanceOfTeamwork', name: 'TheImportanceOfTeamwork', component: ArticlePage },
  { path: '/TheContemporaryWorkLandscapeIsUndergoingASeismicShift', name: 'TheContemporaryWorkLandscapeIsUndergoingASeismicShift', component: ArticlePage },
  { path: '/HowTechnologyIsChangingJobs', name: 'HowTechnologyIsChangingJobs', component: ArticlePage },
  { path: '/TheImpactOfTourismOnLocalCulture', name: 'TheImpactOfTourismOnLocalCulture', component: ArticlePage },
  { path: '/TheImportanceOfFamilyValues', name: 'TheImportanceOfFamilyValues', component: ArticlePage },
  { path: '/WhyReadingBooksIsImportant', name: 'WhyReadingBooksIsImportant', component: ArticlePage },
  { path: '/TheRoleOfMusicInHumanLife', name: 'TheRoleOfMusicInHumanLife', component: ArticlePage },
  { path: '/WhyPeopleShouldVolunteer', name: 'WhyPeopleShouldVolunteer', component: ArticlePage },
  { path: '/TheBenefitsOfTravelingAbroad', name: 'TheBenefitsOfTravelingAbroad', component: ArticlePage },
  { path: '/ShouldPublicTransportBeFree', name: 'ShouldPublicTransportBeFree', component: ArticlePage },
  { path: '/TheImpactOfCarsOnTheEnvironment', name: 'TheImpactOfCarsOnTheEnvironment', component: ArticlePage },
  { path: '/AirTravelLuxuryOrNecessity', name: 'AirTravelLuxuryOrNecessity', component: ArticlePage },
  { path: '/HowTrainsCanReducePollution', name: 'HowTrainsCanReducePollution', component: ArticlePage },
  { path: '/ShouldTheDeathPenaltyExist', name: 'ShouldTheDeathPenaltyExist', component: ArticlePage },
  { path: '/TheImportanceOfStrictTrafficLaws', name: 'TheImportanceOfStrictTrafficLaws', component: ArticlePage },
  { path: '/HowtToReduceCrimeInCities', name: 'HowtToReduceCrimeInCities', component: ArticlePage },
  { path: '/CybercrimeAndOnlineSafety', name: 'CybercrimeAndOnlineSafety', component: ArticlePage },
  { path: '/WhyHonestyIsImportantInSociety', name: 'WhyHonestyIsImportantInSociety', component: ArticlePage },
  { path: '/TheFutureOfRenewableEnergy', name: 'TheFutureOfRenewableEnergy', component: ArticlePage },
  { path: '/HowRobotsAreChangingIndustries', name: 'HowRobotsAreChangingIndustries', component: ArticlePage },
  { path: '/MedicalResearchAndNewDiseases', name: 'MedicalResearchAndNewDiseases', component: ArticlePage },
  { path: '/TheBenefitsOfSpaceTechnology', name: 'TheBenefitsOfSpaceTechnology', component: ArticlePage },
  { path: '/WillHumansLiveOnMars', name: 'WillHumansLiveOnMars', component: ArticlePage },
  { path: '/TheImportanceOfSelfDiscipline', name: 'TheImportanceOfSelfDiscipline', component: ArticlePage },
  { path: '/HowHobbiesImproveMentalHealth', name: 'HowHobbiesImproveMentalHealth', component: ArticlePage },
  { path: '/WhySettingGoalsIsImportant', name: 'WhySettingGoalsIsImportant', component: ArticlePage },
  { path: '/TheImpactOfPositiveThinking', name: 'TheImpactOfPositiveThinking', component: ArticlePage },
  { path: '/TimeManagementAndSuccess', name: 'TimeManagementAndSuccess', component: ArticlePage },
  { path: '/ThePowerOfObservation', name: 'ThePowerOfObservation', component: ArticlePage },
  { path: '/LifeInAVillage', name: 'LifeInAVillage', component: ArticlePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;