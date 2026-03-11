import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages';
import { ScrollToTop } from './components/common/ScrollToTop';

// 数学课程导入
import LessonSymmetry from './pages/lesson-symmetry';
import LessonAngle from './pages/lesson-angle';
import LessonArea from './pages/lesson-area';
import LessonRectangle from './pages/lesson-rectangle';
import LessonSquare from './pages/lesson-square';
import LessonTriangle from './pages/lesson-triangle';
import LessonCircle from './pages/lesson-circle';
import LessonCuboid from './pages/lesson-cuboid';
import LessonCylinder from './pages/lesson-cylinder';
import LessonCone from './pages/lesson-cone';
import LessonMultiplication from './pages/lesson-multiplication';
import LessonDivision from './pages/lesson-division';
import LessonNumberLine from './pages/lesson-number-line';
import LessonPercentage from './pages/lesson-percentage';
import LessonRatio from './pages/lesson-ratio';
import LessonProbability from './pages/lesson-probability';
import LessonVolume from './pages/lesson-volume';
import LessonFraction from './pages/lesson-fraction';
import LessonSquareStats from './pages/lesson-square-stats';

// 科学课程导入
import LessonSound from './pages/lesson-sound';
import LessonWaterCycle from './pages/lesson-water-cycle';
import LessonBuoyancy from './pages/lesson-buoyancy';
import LessonChart from './pages/lesson-chart';
import LessonCircuit from './pages/lesson-circuit';
import LessonClassification from './pages/lesson-classification';
import LessonClock from './pages/lesson-clock';
import LessonEarth from './pages/lesson-earth';
import LessonFoodChain from './pages/lesson-food-chain';
import LessonIncline from './pages/lesson-incline';
import LessonLever from './pages/lesson-lever';
import LessonLight from './pages/lesson-light';
import LessonMagnet from './pages/lesson-magnet';
import LessonMeasurement from './pages/lesson-measurement';
import LessonOrgan from './pages/lesson-organ';
import LessonPlants from './pages/lesson-plants';
import LessonPulley from './pages/lesson-pulley';
import LessonRock from './pages/lesson-rock';
import LessonSolar from './pages/lesson-solar';
import LessonStates from './pages/lesson-states';
import LessonWeather from './pages/lesson-weather';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* 数学课程路由 */}
        <Route path="/lesson/symmetry" element={<LessonSymmetry />} />
        <Route path="/lesson/angle" element={<LessonAngle />} />
        <Route path="/lesson/area" element={<LessonArea />} />
        <Route path="/lesson/rectangle" element={<LessonRectangle />} />
        <Route path="/lesson/square" element={<LessonSquare />} />
        <Route path="/lesson/triangle" element={<LessonTriangle />} />
        <Route path="/lesson/circle" element={<LessonCircle />} />
        <Route path="/lesson/cuboid" element={<LessonCuboid />} />
        <Route path="/lesson/cylinder" element={<LessonCylinder />} />
        <Route path="/lesson/cone" element={<LessonCone />} />
        <Route path="/lesson/multiplication" element={<LessonMultiplication />} />
        <Route path="/lesson/division" element={<LessonDivision />} />
        <Route path="/lesson/number-line" element={<LessonNumberLine />} />
        <Route path="/lesson/percentage" element={<LessonPercentage />} />
        <Route path="/lesson/ratio" element={<LessonRatio />} />
        <Route path="/lesson/probability" element={<LessonProbability />} />
        <Route path="/lesson/volume" element={<LessonVolume />} />
        <Route path="/lesson/fraction" element={<LessonFraction />} />
        <Route path="/lesson/square-stats" element={<LessonSquareStats />} />

        {/* 科学课程路由 */}
        <Route path="/lesson/sound" element={<LessonSound />} />
        <Route path="/lesson/water-cycle" element={<LessonWaterCycle />} />
        <Route path="/lesson/buoyancy" element={<LessonBuoyancy />} />
        <Route path="/lesson/chart" element={<LessonChart />} />
        <Route path="/lesson/circuit" element={<LessonCircuit />} />
        <Route path="/lesson/classification" element={<LessonClassification />} />
        <Route path="/lesson/clock" element={<LessonClock />} />
        <Route path="/lesson/earth" element={<LessonEarth />} />
        <Route path="/lesson/food-chain" element={<LessonFoodChain />} />
        <Route path="/lesson/incline" element={<LessonIncline />} />
        <Route path="/lesson/lever" element={<LessonLever />} />
        <Route path="/lesson/light" element={<LessonLight />} />
        <Route path="/lesson/magnet" element={<LessonMagnet />} />
        <Route path="/lesson/measurement" element={<LessonMeasurement />} />
        <Route path="/lesson/organ" element={<LessonOrgan />} />
        <Route path="/lesson/plants" element={<LessonPlants />} />
        <Route path="/lesson/pulley" element={<LessonPulley />} />
        <Route path="/lesson/rock" element={<LessonRock />} />
        <Route path="/lesson/solar" element={<LessonSolar />} />
        <Route path="/lesson/states" element={<LessonStates />} />
        <Route path="/lesson/weather" element={<LessonWeather />} />
      </Routes>
    </Router>
  );
}

export default App;
