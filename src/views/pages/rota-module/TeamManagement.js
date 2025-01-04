import './managementStyles.css';
import * as d3 from 'd3';
import { OrgChart } from 'd3-org-chart';
import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Divider, IconButton, TextField, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CancelIcon from '@mui/icons-material/Cancel';

export default function TeamManagement() {
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const dragEnabled = useRef(false);
  const [showActions, setShowActions] = useState(false);
  const [undoActions, setUndoActions] = useState([]);
  const [redoActions, setRedoActions] = useState([]);
  const [isCompact, setIsCompact] = useState(true);

  const chartContainerRef = useRef();
  const dataRef = useRef();
  const chartRef = useRef();
  const dragNodeRef = useRef(null);
  const dropNodeRef = useRef(null);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const isDragStartingRef = useRef(false);

  useEffect(() => {
    d3.csv('https://raw.githubusercontent.com/bumbeishvili/sample-data/main/data-oracle.csv').then(
      (data) => {
        // Add a property to determine if the link should be hidden
        const modifiedData = data.map((item) => ({
          ...item,
          hideLink: item.id === '101', // You can set this to true for nodes where you want to hide the link
        }));
        setData(modifiedData);
      },
    );
  }, []);

  useEffect(() => {
    if (data) {
      initializeChart();
    }
  }, [data]);

  useEffect(() => {
    if (chartRef.current) {
      filterChart(searchTerm);
    }
  }, [searchTerm]);

  function initializeChart() {
    const chart = new OrgChart()
      .nodeHeight((d) => 110)
      .nodeWidth((d) => 222)
      .childrenMargin((d) => 50)
      .compactMarginBetween((d) => 35)
      .compactMarginPair((d) => 30)
      .neighbourMargin((d) => 20)
      .nodeContent((d) => generateContent(d))
      .nodeEnter(function (node) {
        d3.select(this).call(
          d3
            .drag()
            .filter(function (x, node) {
              return dragEnabled.current && this.classList.contains('draggable');
            })
            .on('start', function (d, node) {
              onDragStart(this, d, node);
            })
            .on('drag', function (dragEvent, node) {
              onDrag(this, dragEvent);
            })
            .on('end', function (d) {
              onDragEnd(this, d);
            }),
        );
      })
      .nodeUpdate(function (d) {
        if (d.id === '102' || d.id === '120' || d.id === '124') {
          d3.select(this).classed('droppable', false);
        } else {
          d3.select(this).classed('droppable', true);
        }

        if (d.id === '100') {
          d3.select(this).classed('draggable', false);
        } else {
          d3.select(this).classed('draggable', true);
        }
      })
      .linkUpdate(function (d) {
        // Hide the link if hideLink is true
        d3.select(this)
          .attr('stroke', '#E4E2E9')
          .attr('stroke-width', (d) => 1)
          .attr('opacity', d.data.hideLink ? 0 : 1);
      })
      .container(chartContainerRef.current)
      .data(data)
      .render();

    chartRef.current = chart;
  }

  const filterChart = (value) => {
    if (!chartRef.current) return;

    chartRef.current.clearHighlighting();

    const data = chartRef.current.data();
    data.forEach((d) => {
      d._expanded = false;
      if (value !== '' && d.name.toLowerCase().includes(value.toLowerCase())) {
        d._highlighted = true;
        d._expanded = true;
      } else {
        d._highlighted = false;
      }
    });

    chartRef.current.data(data).render().fit();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const toggleCompactMode = () => {
    setIsCompact(!isCompact);
    if (chartRef.current) {
      chartRef.current.compact(!isCompact).render();
    }
  };
  const onDragStart = (element, event, node) => {
    dragNodeRef.current = node;
    const width = node.width;
    const half = width / 2;
    const x = event.x - half;
    dragStartXRef.current = x;
    dragStartYRef.current = event.y;
    isDragStartingRef.current = true;

    d3.select(element).classed('dragging', true);
  };

  function onDrag(element, event) {
    if (!dragNodeRef.current) return;

    const chartState = chartRef.current.getChartState();
    const g = d3.select(element);

    if (isDragStartingRef.current) {
      isDragStartingRef.current = false;
      document.querySelector('.chart-container').classList.add('dragging-active');
      g.raise();

      const descendants = dragNodeRef.current.descendants();
      const linksToRemove = [...descendants, dragNodeRef.current];
      const nodesToRemove = descendants.filter((x) => x.data.id !== dragNodeRef.current.id);

      chartState.linksWrapper
        .selectAll('path.link')
        .data(linksToRemove, (d) => chartState.nodeId(d))
        .remove();
      chartState.nodesWrapper
        .selectAll('g.node')
        .data(nodesToRemove, (d) => chartState.nodeId(d))
        .remove();
    }
    dropNodeRef.current = null;
    const allNodes = d3.selectAll('g.node:not(.dragging)');

    // Reset fill color for all nodes
    allNodes.select('rect').attr('fill', 'none');

    allNodes
      .filter((d2) => {
        const cP = {
          left: event.x,
          right: event.x + dragNodeRef.current.width,
          top: event.y,
          bottom: event.y + dragNodeRef.current.height,
          midX: event.x + dragNodeRef.current.width / 2,
          midY: event.y + dragNodeRef.current.height / 2,
        };
        const cPInner = {
          left: d2.x,
          right: d2.x + d2.width,
          top: d2.y,
          bottom: d2.y + d2.height,
        };

        if (
          cP.midX > cPInner.left &&
          cP.midX < cPInner.right &&
          cP.midY > cPInner.top &&
          cP.midY < cPInner.bottom
        ) {
          dropNodeRef.current = d2;
          return d2;
        }
      })
      .each(function (d) {
        // Check if the node is droppable before changing its color
        if (this.classList.contains('droppable')) {
          d3.select(this).select('rect').attr('fill', '#e4e1e1');
        }
      });

    dragStartXRef.current += event.dx;
    dragStartYRef.current += event.dy;
    g.attr('transform', `translate(${dragStartXRef.current}, ${dragStartYRef.current})`);
  }

  const onDragEnd = (element, event, node) => {
    document.querySelector('.chart-container').classList.remove('dragging-active');
    if (!dragNodeRef.current) return;

    d3.select(element).classed('dragging', false);

    if (!dropNodeRef.current || dragNodeRef.current.parent.id === dropNodeRef.current.id) {
      chartRef.current.render();
      return;
    }
    //here i check for ids that i specifically marke as not droppable. so i would have to change code in two places
    if (dropNodeRef.current.data.id === '102') {
      chartRef.current.render();
      return;
    }

    d3.select(element).remove();

    const data = chartRef.current.getChartState().data;
    const draggedNode = data.find((x) => x.id === dragNodeRef.current.id);
    const oldParentId = draggedNode.parentId;
    draggedNode.parentId = dropNodeRef.current.id;

    setUndoActions((prev) => [...prev, { id: dragNodeRef.current?.id, parentId: oldParentId }]);
    setRedoActions([]);
    dropNodeRef.current = null;
    dragNodeRef.current = null;
    chartRef.current.render();
  };

  const enableDrag = () => {
    dragEnabled.current = true;
    document.querySelector('.chart-container').classList.add('drag-enabled');
  };

  const disableDrag = () => {
    dragEnabled.current = false;
    dataRef.current = data;
    document.querySelector('.chart-container').classList.remove('drag-enabled');
    setUndoActions([]);
    setRedoActions([]);
  };

  const cancelDrag = () => {
    if (undoActions.length === 0) {
      disableDrag();
      return;
    }

    const data = chartRef.current.getChartState().data;
    undoActions.reverse().forEach((action) => {
      const node = data.find((x) => x.id === action.id);
      node.parentId = action.parentId;
    });

    disableDrag();
    chartRef.current.render();
  };

  const undo = () => {
    const action = undoActions.pop();
    if (action) {
      const node = chartRef.current.getChartState().data.find((x) => x.id === action.id);
      const currentParentId = node.parentId;
      const previousParentId = action.parentId;
      action.parentId = currentParentId;
      node.parentId = previousParentId;

      setRedoActions((prev) => [...prev, action]);
      chartRef.current.render();
      updateDragActions();
    }
  };

  const redo = () => {
    const action = redoActions.pop();
    if (action) {
      const node = chartRef.current.getChartState().data.find((x) => x.id === action.id);
      const currentParentId = node.parentId;
      const previousParentId = action.parentId;
      action.parentId = currentParentId;
      node.parentId = previousParentId;
      setUndoActions((prev) => [...prev, action]);
      chartRef.current.render();
      updateDragActions();
    }
  };

  const displayActions = () => {
    setShowActions(true);
    enableDrag();
  };

  const hideActions = (action) => {
    setShowActions(false);
    if (action === 'done') {
      disableDrag();
    }
    if (action === 'cancel') {
      cancelDrag();
    }
  };

  const updateDragActions = () => {
    // Implementation left as is
  };

  const generateContent = (d) => {
    const color = '#FFFFFF';
    const imageDiffVert = 25 + 2;
    return `
      <div class="node-container" style='
      width:${d.width}px;
      height:${d.height}px;
      padding-top:${imageDiffVert - 2}px;
      padding-left:1px;
      padding-right:1px'>
              <div class="content-container" style="font-family: 'Inter', sans-serif;  margin-left:-1px;width:${
                d.width - 2
              }px;height:${d.height - imageDiffVert}px;border-radius:10px;border: ${
      d.data._highlighted || d.data._upToTheRootHighlighted
        ? '5px solid #E27396"'
        : '1px solid #E4E2E9"'
    } >
                  <div style="display:flex;justify-content:flex-end;margin-top:5px;margin-right:8px">#${
                    d.data.id
                  }</div>
                  <div  style="margin-top:${
                    -imageDiffVert - 20
                  }px;margin-left:${15}px;border-radius:100px;width:50px;height:50px;" ></div>
                  <div style="margin-top:${-imageDiffVert - 20}px;">   <img src=" ${
      d.data.image
    }" style="margin-left:${20}px;border-radius:100px;width:40px;height:40px;" /></div>
                  <div style="font-size:15px;color:${
                    d.data._highlighted ? 'red' : 'green'
                  };margin-left:20px;margin-top:10px;">  ${d.data.name} </div>
                  <div style="color:#716E7B;margin-left:20px;margin-top:3px;font-size:10px;"> ${
                    d.data.position
                  } </div>
              </div>
          </div>
      `;
  };

  return (
    <div className="app">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name"
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
            }}
          />
          <Tooltip title={isCompact ? 'Disable Compact Mode' : 'Enable Compact Mode'}>
            <IconButton onClick={toggleCompactMode} color="primary">
              {isCompact ? <ViewComfyIcon /> : <ViewCompactIcon />}
            </IconButton>
          </Tooltip>
          {!showActions ? (
            <Button
              size="small"
              variant="contained"
              startIcon={<EditIcon />}
              onClick={displayActions}
            >
              Organize
            </Button>
          ) : (
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<DoneIcon />}
              onClick={() => hideActions('done')}
            >
              Done
            </Button>
          )}
          {showActions && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title="Undo">
                <span>
                  <IconButton color="primary" disabled={undoActions.length === 0} onClick={undo}>
                    <UndoIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Redo">
                <span>
                  <IconButton color="primary" disabled={redoActions.length === 0} onClick={redo}>
                    <RedoIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Divider orientation="vertical" flexItem />
              <Button
                sx={{ bgcolor: '#fff !important' }}
                size="small"
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => hideActions('cancel')}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <div className="chart-container" ref={chartContainerRef}></div>
    </div>
  );
}
