//import * as alvision from "../../tsbinding/alvision";
//import { BaseApp, RUN_APP, FrameSource, opencv_extra } from "./utility";
//import path = require('path')

//const base_path = "gpu_demos_pack/demos/denoising";



//// 0 - wait
//// 1 - process
//// 2 - finished
//let taskState : alvision.int;

//let stopThread: alvision.int;

//let imgs = new Array<alvision.Mat>();
//let final_pano = new alvision.Mat();

//class StitchingTask : task
//{
//    useGpu: boolean;
//    double gpu_time;
//    double cpu_time;

//    constructor() : useGpu(false), cpu_time(1.0), gpu_time(1.0)
//    {
//    }

//    task* execute()
//    {
//        while (taskState != 1)
//            this_tbb_thread::sleep(tick_count::interval_t(0.03));

//        const int64 proc_start = getTickCount();
//        {
//            Stitcher stitcher = Stitcher::createDefault(useGpu);

//            stitcher.estimateTransform(imgs);

//            stitcher.composePanorama(imgs, final_pano);
//        }

//        const double pano_time = (getTickCount() - proc_start) / getTickFrequency();
//        if (useGpu)
//            gpu_time = pano_time;
//        else
//            cpu_time = pano_time;

//        final_pano = final_pano.clone();
//        taskState.store(2);

//        if (!stopThread)
//            self().recycle_to_reexecute();

//        return 0;
//    }
//};

//class App extends BaseApp
//{
//public:
//    App();

//protected:
//    void runAppLogic();
//    void printAppHelp();

//private:
//    std::vector< std::pair<std::string, int> > panoSources_;
//    int panoIdx_;
//};

//App::App()
//{
//    panoSources_.push_back(make_pair("data/stitching_0%d.jpg", 9));
//    panoIdx_ = 0;
//}

//void App::runAppLogic()
//{
//    sources_.clear();
//    for (size_t i = 0; i < panoSources_.size(); ++i)
//        sources_.push_back(FrameSource::imagesPattern(panoSources_[i].first));

//    const int w_width = 1920;
//    const int w_height = 1080;
//    const int w_grid_border = 30;
//    const int w_half_border = w_grid_border >> 1;

//    int track = 10;

//    taskState.store(0);
//    stopThread.store(0);

//    StitchingTask* task = new(task::allocate_root()) StitchingTask;
//    task::enqueue(*task);

//    Mat imgGrid(w_height, w_width, CV_8UC3, Scalar::all(0));
//    Mat imgGridForDraw;

//    const string wndName = "Stitching Demo";

//    namedWindow(wndName, WINDOW_NORMAL);
//    setWindowProperty(wndName, WND_PROP_FULLSCREEN, CV_WINDOW_FULLSCREEN);
//    setWindowProperty(wndName, WND_PROP_ASPECT_RATIO, CV_WINDOW_KEEPRATIO);

//    while(isActive())
//    {
//        if (taskState == 0)
//        {
//            imgs.clear();
//            int frames_counter = 0;
//            while (frames_counter++ < panoSources_[panoIdx_].second)
//            {
//                Mat frame;
//                sources_[panoIdx_]->next(frame);
//                if (frame.empty()) break;
//                imgs.push_back(frame.clone());
//            }

//            size_t src_size = imgs.size();
//            int h = (int)sqrt((double)src_size);
//            int w = ((h+1) * h <= src_size )? h+1 : h;

//            int t = static_cast<int>(src_size) - w * h;
//            int t_com = 0;

//            imgGrid.setTo(Scalar::all(0));

//            int w_cell = (w_width - 2 * w_grid_border) / (w + (t ? 1 : 0));
//            int h_cell = (w_height - 2 * w_grid_border) / h;

//            int k = 0;
//            for(int i = w_grid_border; i < w_width - w_grid_border; i += w_cell)
//            {
//                t_com = 0;
//                for(int j = w_grid_border; j < w_height - w_grid_border; j +=h_cell)
//                {
//                    int start_sub_pos = ( t > 0 && t_com >= t) ? (w_cell >> 1): 0;
//                    if (k >= src_size ) break;
//                    const Mat sub(imgGrid, Rect(i + w_half_border  + start_sub_pos, j + w_half_border, w_cell - w_half_border, h_cell - w_half_border));
//                    resize(imgs[k++], sub, sub.size());
//                    if (t) t_com++;
//                }
//            }

//            panoIdx_ = (panoIdx_ + 1) % panoSources_.size();

//            imgGrid.copyTo(imgGridForDraw);

//            taskState.store(1);
//        }

//        ostringstream msg;
//        if (track <= 10)
//        {
//            imshow(wndName, imgGridForDraw);
//            displayOverlay(wndName, "GTC presentation stitching OpenCV GPU vs. CPU comparison", 1);

//            msg << "Sources images: " << imgs.size();

//            addText(imgGridForDraw, msg.str(), Point(w_width >> 2 , w_height >> 2 ),
//                    fontQt("CV_FONT_BLACK", 40, Scalar(255, 255, 255, 0)));
//            msg.str("");

//            msg << "Images resolution: " << cvRound(imgs[0].cols * imgs[0].rows / 100000)/10.0f << " Mp";
//            addText(imgGridForDraw, msg.str(), Point( w_width >> 2, (w_height >> 2) + 70),
//                    fontQt("CV_FONT_BLACK", 40, Scalar(255, 255, 255, 0)));
//            msg.str("");

//            msg << "Used " << ( task->useGpu ? "GPU" : "CPU") << " version";
//            addText(imgGridForDraw, msg.str(), Point(w_width >> 2, (w_height >> 2) + 140),
//                    fontQt("CV_FONT_BLACK", 40, Scalar(255, 255, 255, 0)));
//            msg.str("");

//            imshow(wndName, imgGridForDraw);
//        }

//        Mat prog(imgGridForDraw, Rect(w_width >> 2, (w_height >> 2) + 210, track, 40));
//        prog.setTo(Scalar(255,255,255,0));
//        imshow(wndName, imgGridForDraw);

//        wait(300);

//        track +=10;
//        if (track >= (w_width >> 1))
//            track = w_width >> 1;

//        if (taskState == 2)
//        {
//            Mat dst(w_height, w_width, CV_8UC3, Scalar::all(0));
//            int sub_rows = (w_height * final_pano.rows) / final_pano.cols;
//            Mat sub_dst(dst, Rect(0, (w_height - sub_rows) >> 1, w_width, sub_rows ));
//            resize(final_pano, sub_dst, sub_dst.size());

//            msg << "Panorama resolution: " << cvRound(final_pano.cols * final_pano.rows / 100000)/10.0f << " Mp";
//            addText(dst, msg.str(), Point(w_width >> 2 , w_height >> 4 ),
//                    fontQt("CV_FONT_BLACK", 40, Scalar(255, 255, 255, 0)));
//            msg.str("");

//            Scalar time_color;
//            if (task->useGpu)
//                time_color = Scalar(124,250,0,0);
//            else
//                time_color = Scalar(255,19,19,0);

//            msg << "Panorama composition time: " << (task->useGpu ? task->gpu_time : task->cpu_time)  << " sec";
//            addText(dst, msg.str(), Point( w_width >> 2, (w_height >> 4) + 70),
//                    fontQt("CV_FONT_BLACK", 40, time_color));
//            msg.str("");

//            if (task->useGpu)
//            {
//                msg << "GPU optimization speedup: " << task->cpu_time / task->gpu_time << "x";
//                addText(dst, msg.str(), Point(w_width >> 2, (w_height >> 4) + 140),
//                        fontQt("CV_FONT_BLACK", 40, Scalar(255, 19, 19, 0)));
//                msg.str("");
//            }

//            imshow(wndName, dst);
//            wait(10000);

//            track = 10;

//            task->useGpu = !task->useGpu;
//            if (!task->useGpu)
//                taskState.store(0);
//            else
//            {
//                imgGrid.copyTo(imgGridForDraw);
//                taskState.store(1);
//            }
//        }
//    }

//    stopThread.store(1);
//}

//void App::printAppHelp()
//{
//    console.log("This sample demonstrates Rotation model images stitcher ");

//    console.log("Usage: demo_stereo_matching [options] ");
//}

//RUN_APP(App)
