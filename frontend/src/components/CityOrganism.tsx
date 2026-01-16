'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CityVitals } from '@/types/vitals';
import styles from './CityOrganism.module.css';

interface CityOrganismProps {
  vitals: CityVitals;
}

export default function CityOrganism({ vitals }: CityOrganismProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Clear previous content
    svg.selectAll('*').remove();

    // Set up SVG dimensions
    svg.attr('width', width).attr('height', height);

    const centerX = width / 2;
    const centerY = height / 2;

    // Create main organism group
    const organism = svg.append('g').attr('class', 'organism');

    // ARTERIES (Traffic System)
    // Network of pulsating lines representing traffic flow
    const arteryGroup = organism.append('g').attr('class', 'arteries');
    
    const arteryPaths = [
      { d: `M ${centerX - 200} ${centerY} Q ${centerX - 100} ${centerY - 100} ${centerX} ${centerY}`, id: 'artery1' },
      { d: `M ${centerX + 200} ${centerY} Q ${centerX + 100} ${centerY - 100} ${centerX} ${centerY}`, id: 'artery2' },
      { d: `M ${centerX} ${centerY - 200} Q ${centerX + 100} ${centerY - 100} ${centerX} ${centerY}`, id: 'artery3' },
      { d: `M ${centerX} ${centerY + 200} Q ${centerX - 100} ${centerY + 100} ${centerX} ${centerY}`, id: 'artery4' },
    ];

    arteryPaths.forEach((path) => {
      const trafficValue = vitals.arteries?.value ?? 0;
      const strokeWidth = 2 + trafficValue * 8; // Constricts with stress
      const opacity = 0.3 + trafficValue * 0.7;
      const color = d3.interpolateReds(0.3 + trafficValue * 0.7);

      arteryGroup
        .append('path')
        .attr('d', path.d)
        .attr('stroke', color)
        .attr('stroke-width', strokeWidth)
        .attr('fill', 'none')
        .attr('opacity', opacity)
        .attr('class', 'artery')
        .style('filter', 'url(#glow)');
    });

    // Animate pulse based on traffic
    const trafficValue = vitals.arteries?.value ?? 0;
    const pulseDuration = Math.max(500, 2000 - trafficValue * 1500);
    arteryGroup
      .selectAll('.artery')
      .transition()
      .duration(pulseDuration)
      .ease(d3.easeSinInOut)
      .attr('stroke-width', function() {
        return parseFloat(d3.select(this).attr('stroke-width') as string) * 1.2;
      })
      .transition()
      .duration(pulseDuration)
      .attr('stroke-width', function() {
        return parseFloat(d3.select(this).attr('stroke-width') as string) / 1.2;
      })
      .on('end', function repeat() {
        d3.select(this)
          .transition()
          .duration(pulseDuration)
          .attr('stroke-width', function() {
            return parseFloat(d3.select(this).attr('stroke-width') as string) * 1.2;
          })
          .transition()
          .duration(pulseDuration)
          .attr('stroke-width', function() {
            return parseFloat(d3.select(this).attr('stroke-width') as string) / 1.2;
          })
          .on('end', repeat);
      });

    // LUNGS (Air Quality System)
    // Two expanding/contracting shapes
    const lungGroup = organism.append('g').attr('class', 'lungs');
    
    const airQualityValue = vitals.lungs?.value ?? 0;
    const lungScale = 1 - airQualityValue * 0.4; // Shrinks with poor air quality
    const lungOpacity = 0.2 + airQualityValue * 0.5;
    const lungColor = d3.interpolateBlues(0.4 + airQualityValue * 0.6);

    // Left lung
    lungGroup
      .append('ellipse')
      .attr('cx', centerX - 80)
      .attr('cy', centerY - 50)
      .attr('rx', 60 * lungScale)
      .attr('ry', 80 * lungScale)
      .attr('fill', lungColor)
      .attr('opacity', lungOpacity)
      .attr('class', 'lung-left');

    // Right lung
    lungGroup
      .append('ellipse')
      .attr('cx', centerX + 80)
      .attr('cy', centerY - 50)
      .attr('rx', 60 * lungScale)
      .attr('ry', 80 * lungScale)
      .attr('fill', lungColor)
      .attr('opacity', lungOpacity)
      .attr('class', 'lung-right');

    // Breathing animation
    const breathDuration = Math.max(1000, 3000 - airQualityValue * 1500);
    lungGroup
      .selectAll('ellipse')
      .transition()
      .duration(breathDuration)
      .ease(d3.easeSinInOut)
      .attr('ry', function() {
        return parseFloat(d3.select(this).attr('ry') as string) * 1.15;
      })
      .transition()
      .duration(breathDuration)
      .attr('ry', function() {
        return parseFloat(d3.select(this).attr('ry') as string) / 1.15;
      })
      .on('end', function repeat() {
        d3.select(this)
          .transition()
          .duration(breathDuration)
          .attr('ry', function() {
            return parseFloat(d3.select(this).attr('ry') as string) * 1.15;
          })
          .transition()
          .duration(breathDuration)
          .attr('ry', function() {
            return parseFloat(d3.select(this).attr('ry') as string) / 1.15;
          })
          .on('end', repeat);
      });

    // NEURAL SYSTEM (Power Grid)
    // Flickering network of connections
    const neuralGroup = organism.append('g').attr('class', 'neural');
    
    const neuralPoints = d3.range(20).map(() => ({
      x: centerX + (Math.random() - 0.5) * 300,
      y: centerY + (Math.random() - 0.5) * 300,
    }));

    const powerValue = vitals.neural?.value ?? 0;
    const neuralBrightness = 1 - powerValue * 0.7; // Dims with power stress
    const neuralColor = d3.interpolateYlOrRd(powerValue);

    neuralPoints.forEach((point, i) => {
      neuralGroup
        .append('circle')
        .attr('cx', point.x)
        .attr('cy', point.y)
        .attr('r', 3)
        .attr('fill', neuralColor)
        .attr('opacity', neuralBrightness * (0.3 + Math.random() * 0.7))
        .attr('class', 'neural-node');

      // Connect to nearby points
      neuralPoints.forEach((other, j) => {
        if (i < j && Math.hypot(point.x - other.x, point.y - other.y) < 100) {
          neuralGroup
            .append('line')
            .attr('x1', point.x)
            .attr('y1', point.y)
            .attr('x2', other.x)
            .attr('y2', other.y)
            .attr('stroke', neuralColor)
            .attr('stroke-width', 1)
            .attr('opacity', neuralBrightness * 0.3)
            .attr('class', 'neural-connection');
        }
      });
    });

    // Flicker effect
    const powerValueForFlicker = vitals.neural?.value ?? 0;
    const flickerInterval = Math.max(100, 500 - powerValueForFlicker * 400);
    neuralGroup
      .selectAll('.neural-node')
      .transition()
      .duration(flickerInterval)
      .attr('opacity', function() {
        return neuralBrightness * Math.random();
      })
      .on('end', function repeat() {
        d3.select(this)
          .transition()
          .duration(flickerInterval)
          .attr('opacity', neuralBrightness * Math.random())
          .on('end', repeat);
      });

    // IMMUNE SYSTEM (Emergency Response)
    // Particles moving around the organism
    const immuneGroup = organism.append('g').attr('class', 'immune');
    
    const emergencyValue = vitals.immune?.value ?? 0;
    const particleCount = Math.floor(10 + emergencyValue * 30);
    const particleSpeed = 1 - emergencyValue * 0.7; // Slows with stress
    const immuneColor = d3.interpolateGreens(0.5 - emergencyValue * 0.5);

    d3.range(particleCount).forEach((_, i) => {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 150;
      const startX = centerX + Math.cos(angle) * radius;
      const startY = centerY + Math.sin(angle) * radius;

      immuneGroup
        .append('circle')
        .attr('cx', startX)
        .attr('cy', startY)
        .attr('r', 2 + emergencyValue * 3)
        .attr('fill', immuneColor)
        .attr('opacity', 0.6)
        .attr('class', 'immune-particle')
        .transition()
        .duration(3000 / particleSpeed)
        .ease(d3.easeLinear)
        .attrTween('cx', function() {
          return function(t) {
            return (centerX + Math.cos(angle + t * Math.PI * 2) * radius).toString();
          };
        })
        .attrTween('cy', function() {
          return function(t) {
            return (centerY + Math.sin(angle + t * Math.PI * 2) * radius).toString();
          };
        })
        .on('end', function repeat() {
          d3.select(this)
            .transition()
            .duration(3000 / particleSpeed)
            .ease(d3.easeLinear)
            .attrTween('cx', function() {
              return function(t) {
                return (centerX + Math.cos(angle + t * Math.PI * 2) * radius).toString();
              };
            })
            .attrTween('cy', function() {
              return function(t) {
                return (centerY + Math.sin(angle + t * Math.PI * 2) * radius).toString();
              };
            })
            .on('end', repeat);
        });
    });

    // Add glow filter
    const defs = svg.append('defs');
    const filter = defs.append('filter').attr('id', 'glow');
    filter
      .append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  }, [vitals]);

  return (
    <div ref={containerRef} className={styles.container}>
      <svg ref={svgRef} className={styles.svg} />
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.label}>Hour:</span>
          <span className={styles.value}>{vitals.hour}:00</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.label}>Traffic:</span>
          <span className={styles.value}>{((vitals.arteries?.value ?? 0) * 100).toFixed(0)}%</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.label}>Air Quality:</span>
          <span className={styles.value}>{((vitals.lungs?.value ?? 0) * 100).toFixed(0)}%</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.label}>Power:</span>
          <span className={styles.value}>{((vitals.neural?.value ?? 0) * 100).toFixed(0)}%</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.label}>Emergency:</span>
          <span className={styles.value}>{((vitals.immune?.value ?? 0) * 100).toFixed(0)}%</span>
        </div>
        <div className={`${styles.statItem} ${styles.overall}`}>
          <span className={styles.label}>Overall Stress:</span>
          <span className={styles.value}>{((vitals.overall_stress ?? 0) * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
