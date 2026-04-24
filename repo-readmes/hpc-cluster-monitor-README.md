# HPC Cluster Health Monitor

> Real-time observability dashboard for GPU clusters — tracking 100+ nodes across NVIDIA GB200 NVL72 and H100 systems at Wistron Corporation.

---

## Overview

Purpose-built monitoring system for **AI HPC infrastructure** at scale. Aggregates GPU utilization, temperature, InfiniBand fabric health, NVMe storage I/O, and Slurm job queues into a unified real-time dashboard. Reduced mean-time-to-detect hardware failures from **hours to under 5 minutes**.

---

## Architecture

```
Cluster Nodes (100+)
    │
    ├── GPU Metrics (DCGM Exporter)
    ├── InfiniBand Stats (ibstat / perfquery)
    ├── NVMe I/O (node_exporter)
    └── Slurm Job Queue (sacct / squeue)
    │
    ▼
Prometheus  ──────► Alertmanager ──► PagerDuty / Slack
    │
    ▼
Grafana Dashboards
    │
    ├── GPU Utilization & Temperature
    ├── InfiniBand Link Health (HDR/NDR)
    ├── Memory Bandwidth (HBM3e)
    ├── Job Queue Depth & Wait Times
    └── Node Failure Heatmap
```

---

## Key Metrics Tracked

| Category | Metrics |
|---|---|
| GPU | Utilization %, VRAM usage, SM clock, power draw, ECC errors |
| Memory | HBM3e bandwidth (GB/s), allocation, fragmentation |
| Fabric | InfiniBand link state, port errors, throughput, retransmits |
| Storage | NVMe-oF IOPS, latency, queue depth |
| Jobs | Queue length, wait time, GPU allocation per job, failed jobs |
| Thermal | GPU temp, coolant inlet/outlet delta, rack PDU readings |

---

## Tech Stack

- **Python** — data collection scripts, alerting logic, DCGM integration
- **Prometheus** — metrics scraping and storage (15s resolution)
- **Grafana** — visualization, alerting, dashboard templating
- **Bash** — node health checks, OFED/InfiniBand diagnostics
- **Slurm** — job scheduler integration via REST API
- **NVIDIA DCGM** — deep GPU telemetry (NVLink, ECC, clocks)

---

## Results

- **MTTD reduced** from ~2 hours to <5 minutes for GPU/fabric failures
- **100+ nodes** monitored continuously across GB200 NVL72 and H100 clusters
- **Automated alerting** for ECC error thresholds, IB link flaps, and thermal excursions
- **Slurm integration** provides job-level GPU efficiency reporting for clients

---

*Mir Hyder Ali · AI HPC Infrastructure Lead Engineer · Wistron Corporation*  
*[LinkedIn](https://www.linkedin.com/in/mir-hyder-ali) · [Portfolio](https://mirhyderali.com)*
