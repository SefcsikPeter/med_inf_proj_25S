import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryService } from '../../service/story.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RadialTreeComponent } from '../radial-tree/radial-tree.component';
import { SliderComponent } from '../slider/slider.component';
import { Subject, firstValueFrom } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { InfectionTreeService } from '../../service/infection-tree.service';
import { LinePlotComponent } from '../line-plot/line-plot.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {VisualizationWrapperComponent} from '../visualization-wrapper/visualization-wrapper.component';
import {SliderWrapperComponent} from '../slider-wrapper/slider-wrapper.component';
import { EpiModelService } from '../../service/epi-model.service';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [CommonModule, MatProgressBar, RadialTreeComponent, SliderComponent, LinePlotComponent, VisualizationWrapperComponent, SliderWrapperComponent, RouterLink],
  templateUrl: './story.component.html',
  styleUrl: './story.component.css'
})
export class StoryComponent implements OnInit {
  @Input() storyId: number = 0;

  currentSlide: number = 0;
  totalSlides: number = 0;
  title: string = '';
  slide: any = null;
  imagePath: string = '';
  infectionTreeData: any = {};
  showVis1: boolean = false;
  dataParams: any;
  vis1: any;
  vis2: any;
  sliders: any;
  showVis2: boolean = false;
  showSliders: boolean = false;

  constructor(
    private storyService: StoryService,
    private treeService: InfectionTreeService,
    private modelSerivce: EpiModelService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.showSliders = false;
    this.route.paramMap.subscribe(params => {
      this.storyId = Number(params.get('story_id')) || 0;
    });

    this.route.queryParamMap.subscribe(params => {
      this.currentSlide = Number(params.get('page')) || 0;
    });

    this.loadData();
    this.loadSlide(this.currentSlide);
  }

  loadData(): void {
    this.storyService.getStoryData(this.storyId).subscribe({
      next: (data) => {
        this.title = data.title;
        this.totalSlides = data.total_pages;
        console.log('loaded title and size', data);
      },
      error: (err) => {
        console.log('Error fetching title and size', err);
      }
    });
  }

  async fetchDummyTree(numIter: number): Promise<boolean> {
    try {
      const data = await firstValueFrom(this.treeService.getDummyTree(numIter));
      this.infectionTreeData = data;
      console.log(data);
      return true;
    } catch (err) {
      console.error('Error fetching infection tree:', err);
      return false;
    }
  }

  async fetchSIRData(): Promise<boolean> {
    try {
      const data = await firstValueFrom(this.modelSerivce.getSIR(this.dataParams));
      this.infectionTreeData = data;
      console.log('data', this.infectionTreeData)
      return true;
    } catch (err) {
      console.error('Error fetching SIR data:', err);
      return false;
    }
  }

  async loadSlide(index: number): Promise<void> {
    console.log('loading slide', this.slide)
    this.storyService.getStorySlide(this.storyId, index).subscribe({
      next: async (data) => {
        this.slide = data.slide;
        console.log('slide', this.slide)
        this.currentSlide = data.page;
        this.imagePath = 'http://localhost:8000/static/images/';
        if (data.image != null) {
          this.imagePath += data.image;
        }
        if (this.slide.data != null) {
          this.dataParams = this.slide.data;
          console.log(this.dataParams)
          await this.handleWrapperFetch();
        }

        if (this.slide.vis1 != null) {
          this.vis1 = this.slide.vis1;
          this.showVis1 = true;
        }

        if (this.slide.vis2 != null) {
          this.vis2 = this.slide.vis2;
          this.showVis2 = true;
        }

        if (this.slide.sliders != null) {
          this.sliders = this.slide.sliders;
          this.showSliders = true;
          console.log(this.sliders)
        }

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { page: this.currentSlide },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      },
      error: (err) => {
        console.error('Failed to load story slide:', err);
      }
    });
  }

  nextSlide(): void {
    if (this.currentSlide < this.totalSlides - 1) {
      this.loadSlide(this.currentSlide + 1);
      this.showVis1 = false;
      this.showVis2 = false;
      this.showSliders = false;
    }
  }

  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.loadSlide(this.currentSlide - 1);
      this.showVis1 = false;
      this.showVis2 = false;
      this.showSliders = false;
    }
  }

  async handleWrapperFetch(): Promise<boolean> {
    if (this.dataParams.type === "dummy_tree") {
      return this.fetchDummyTree(this.dataParams.num_iter);
    } else if (this.dataParams.type === "sir") {
      return this.fetchSIRData();
    } else {
      return false;
    }
  }

  handleSliderValues(values: Record<string, number>) {
    if (values['depth']) {
      this.vis1 = {
        ...this.vis1,
        depth: values['depth']
      };
    } else if (values['depth'] === 0) {
      this.vis1 = {
        ...this.vis1,
        depth: values['depth']
      };
    }
  }
}
